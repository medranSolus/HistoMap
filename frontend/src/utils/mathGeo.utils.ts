export const TO_RADIANS = Math.PI / 180;
export const TO_DEGREES = 180 / Math.PI;

// Helper function: cross product of two vectors v0&v1
export const cross = function (v0, v1) {
	return [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
};

//Helper function: dot product of two vectors v0&v1
export const dot = function (v0, v1) {
	for (var i = 0, sum = 0; v0.length > i; ++i) sum += v0[i] * v1[i];
	return sum;
};

// Helper function:
// This functi0n converts a [lon, lat] coordinates into a [x,y,z] coordinate
// the [x, y, z] is Cartesian, with origin at lon/lat (0,0) center of the earth
export const lonlat2xyz = function (coord) {
	var lon = coord[0] * TO_RADIANS;
	var lat = coord[1] * TO_RADIANS;

	var x = Math.cos(lat) * Math.cos(lon);

	var y = Math.cos(lat) * Math.sin(lon);

	var z = Math.sin(lat);

	return [x, y, z];
};

// Helper function:
// This functi0n computes a quaternion representation for the rotation between to vectors
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
export const quaternion = function (v0, v1) {
	if (v0 && v1) {
		var w = cross(v0, v1), // vector pendicular to v0 & v1
			w_len = Math.sqrt(dot(w, w)); // length of w

		if (w_len == 0) return;

		var theta = 0.5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1)))),
			qi = (w[2] * Math.sin(theta)) / w_len,
			qj = (-w[1] * Math.sin(theta)) / w_len,
			qk = (w[0] * Math.sin(theta)) / w_len,
			qr = Math.cos(theta);

		return theta && [qr, qi, qj, qk];
	}
};

// Helper function:
// This functions converts euler angles to quaternion
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
export const euler2quat = function (e) {
	if (!e) return;

	var roll = 0.5 * e[0] * TO_RADIANS,
		pitch = 0.5 * e[1] * TO_RADIANS,
		yaw = 0.5 * e[2] * TO_RADIANS,
		sr = Math.sin(roll),
		cr = Math.cos(roll),
		sp = Math.sin(pitch),
		cp = Math.cos(pitch),
		sy = Math.sin(yaw),
		cy = Math.cos(yaw),
		qi = sr * cp * cy - cr * sp * sy,
		qj = cr * sp * cy + sr * cp * sy,
		qk = cr * cp * sy - sr * sp * cy,
		qr = cr * cp * cy + sr * sp * sy;

	return [qr, qi, qj, qk];
};

// This functions computes a quaternion multiply
// Geometrically, it means combining two quant rotations
// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/arithmetic/index.htm
export const quatMultiply = function (q1, q2) {
	if (!q1 || !q2) return;

	var a = q1[0],
		b = q1[1],
		c = q1[2],
		d = q1[3],
		e = q2[0],
		f = q2[1],
		g = q2[2],
		h = q2[3];

	return [
		a * e - b * f - c * g - d * h,
		b * e + a * f + c * h - d * g,
		a * g - b * h + c * e + d * f,
		a * h + b * g - c * f + d * e
	];
};

// This functi0n computes quaternion to euler angles
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
export const quat2euler = function (t): [number, number, number] {
	if (!t) return;

	return [
		Math.atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2])) * TO_DEGREES,
		Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) * TO_DEGREES,
		Math.atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3])) * TO_DEGREES
	];
};

/*  This functi0n computes the euler angles when given two vectors, and a rotation
	This is really the only math functi0n called with d3 code.

	v0 - starting pos in lon/lat, commonly obtained by projection.invert
	v1 - ending pos in lon/lat, commonly obtained by projection.invert
	o0 - the projection rotation in euler angles at starting pos (v0), commonly obtained by projection.rotate
*/

export const eulerAngles = function (v0, v1, o0): [number, number, number] {
	/*
		The math behind this:
		- first calculate the quaternion rotation between the two vectors, v0 & v1
		- then multiply this rotation onto the original rotation at v0
		- finally convert the resulted quat angle back to euler angles for d3 to rotate
	*/

	var t = quatMultiply(euler2quat(o0), quaternion(lonlat2xyz(v0), lonlat2xyz(v1)));
	return quat2euler(t);
};
