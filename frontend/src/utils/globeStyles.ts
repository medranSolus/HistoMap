import * as topojson from 'topojson-client';

export type SVG = any; //d3.Selection<SVGSVGElement, any, any, any>;

export type SVGSelection = d3.Selection<d3.BaseType, unknown, d3.BaseType, any>;

export type Point = [number, number];

export const addGlobeShadow = function (svg: SVG, projection, [width, height]: [number, number]) {
	var drop_shadow = svg
		.append('defs')
		.append('radialGradient')
		.attr('id', 'drop_shadow')
		.attr('cx', '50%')
		.attr('cy', '50%');
	drop_shadow.append('stop').attr('offset', '20%').attr('stop-color', '#000').attr('stop-opacity', '.5');
	drop_shadow.append('stop').attr('offset', '100%').attr('stop-color', '#000').attr('stop-opacity', '0');

	const OFFSET_X = width - Math.floor(width / 2) + 20;
	const OFFSET_Y = Math.floor(height / 2) - 210;

	svg.append('ellipse')
		.attr('cx', width - OFFSET_X)
		.attr('cy', height - OFFSET_Y)
		.attr('rx', projection.scale() * 0.9)
		.attr('ry', projection.scale() * 0.25)
		.attr('class', 'noclicks')
		.style('fill', 'url(#drop_shadow)');
};

export const scaleGlobShadow = function (
	svg: d3.Selection<SVGSVGElement, any, any, any>,
	projection: d3.GeoProjection,
	[width, height]: [number, number]
) {
	const SCALE = projection.scale();
	const OFFSET_X = width - Math.floor(width / 2) + 20;
	const OFFSET_Y = Math.floor(height / 2) - 210 - SCALE + 220;

	svg.select('ellipse')
		.attr('cx', width - OFFSET_X)
		.attr('cy', height - OFFSET_Y)
		.attr('rx', SCALE * 0.9)
		.attr('ry', SCALE * 0.25);
};

export const addGlobeBaseColor = function (svg: SVG, projection, [width, height]: [number, number]) {
	var ocean_fill = svg
		.append('defs')
		.append('radialGradient')
		.attr('id', 'ocean_fill')
		.attr('cx', '75%')
		.attr('cy', '25%');
	ocean_fill.append('stop').attr('offset', '5%').attr('stop-color', '#fff');
	ocean_fill.append('stop').attr('offset', '100%').attr('stop-color', '#ababab');

	svg.append('circle')
		.attr('cx', width / 2)
		.attr('cy', height / 2)
		.attr('r', projection.scale())
		.attr('class', 'noclicks')
		.attr('id', 'ocean_fill_circle')
		.style('fill', 'url(#ocean_fill)');
};

export const scaleGlobeBaseColorCircle = function (
	svg: d3.Selection<SVGSVGElement, any, any, any>,
	projection: d3.GeoProjection,
	[width, height]: [number, number]
) {
	svg.select('circle#ocean_fill_circle').attr('r', projection.scale());
};

export const addGlobeHighlight = function (svg: SVG, projection, [width, height]: [number, number]) {
	var globe_highlight = svg
		.append('defs')
		.append('radialGradient')
		.attr('id', 'globe_highlight')
		.attr('cx', '75%')
		.attr('cy', '25%');
	globe_highlight.append('stop').attr('offset', '5%').attr('stop-color', '#ffd').attr('stop-opacity', '0.6');
	globe_highlight.append('stop').attr('offset', '100%').attr('stop-color', '#ba9').attr('stop-opacity', '0.2');

	svg.append('circle')
		.attr('cx', width / 2)
		.attr('cy', height / 2)
		.attr('r', projection.scale())
		.attr('class', 'noclicks')
		.attr('id', 'globe_highlight_circle')
		.style('fill', 'url(#globe_highlight)');
};

export const removeGlobeHighlight = function (svg) {
	svg.select('#globe_highlight_circle').remove();
};

export const scaleGlobeHighlight = function (
	svg: d3.Selection<SVGSVGElement, any, any, any>,
	projection: d3.GeoProjection,
	[width, height]: [number, number]
) {
	svg.select('circle#globe_highlight_circle').attr('r', projection.scale());
};

export const addGlobeShading = function (svg: SVG, projection, [width, height]: [number, number]) {
	var globe_shading = svg
		.append('defs')
		.append('radialGradient')
		.attr('id', 'globe_shading')
		.attr('cx', '55%')
		.attr('cy', '45%');
	globe_shading.append('stop').attr('offset', '30%').attr('stop-color', '#fff').attr('stop-opacity', '0');
	globe_shading.append('stop').attr('offset', '100%').attr('stop-color', '#505962').attr('stop-opacity', '0.3');

	svg.append('circle')
		.attr('cx', width / 2)
		.attr('cy', height / 2)
		.attr('r', projection.scale())
		.attr('id', 'globe_shading_circle')
		.attr('class', 'noclicks')
		.style('fill', 'url(#globe_shading)');
};

export const scaleGlobeShading = function (svg: SVG, projection, [width, height]: [number, number]) {
	svg.select('circle#globe_shading_circle').attr('r', projection.scale());
};

export const removeGlobeShading = function (svg) {
	svg.select('#globe_shading_circle').remove();
};

export const layerJsonOnGlobe = function (svg: SVG, path, world) {
	return svg
		.append('path')
		.datum(topojson.feature(world, world.objects.countries))
		.attr('class', 'land noclicks')
		.attr('d', path);
};

export const removeExistingJsonOnGlobe = function (svg: d3.Selection<SVGSVGElement, any, any, any>) {
	svg.select('path.land').remove();
};

export const addWorldMapConnections = function (svg: SVG, path, data, projection) {
	return (
		svg
			.append('g')
			.attr('class', 'arcs')
			.selectAll('path')
			.data(data)
			.enter()
			.append('path')
			.attr('class', 'arc')
			// @ts-ignore
			.attr('d', path)
			.attr('marker-end', 'url(#triangle)')
		// .attr('transform', (d) => `translate(${projection([d.long, d.lat])}`)
	);
};

export const applyWorldMapConnections = function (svg: SVG, path) {
	svg.selectAll('.arcs > path.arc').attr('d', path);
};

export const removeWorldMapConnections = function (svg) {
	svg.selectAll('.arcs > path.arc');
};

export const drawOnMap = function (svg: SVG, path, data, id, color?: string, stroke?: string) {
	const g = svg.append('g');

	g.attr('id', id);
	const object = g.selectAll('path').data(data.features).enter().append('path').attr('d', path);

	if (color) object.attr('fill', color);
	if (stroke) object.attr('stroke', stroke);
};

export const applyToDraw = function (svg: SVG, path, selector: string, callback?: (draw: SVGSelection) => void) {
	const draw = svg.select(selector).selectAll('path');
	draw.attr('d', path);
	if (callback) callback(draw);
};

export const removeFromMap = function (svg: SVG, selector: string) {
	svg.select(selector).remove();
};

export const setMarkersOnMap = function (
	svg: SVG,
	projection,
	features: any[],
	onMarkerClick?: (feature) => () => void
) {
	svg.selectAll('g.marker-container').remove();
	for (var j = 0; j < features.length; j++) {
		const { longitude, latitude } = features[j].geometry.coordinates;
		const [x, y] = projection([longitude, latitude]);
		const [x_copy, y_copy] = [longitude, latitude];
		const count = features[j].properties?.count;

		const g = svg.append('g').attr('class', 'marker-container');

		const path = g
			.append('path')
			.attr('class', 'marker')
			.attr('d', 'M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z')
			.attr('transform', 'translate(' + x + ',' + y + ')')
			.attr('x', x_copy)
			.attr('y', y_copy)
			.text(count);

		path.on('click', onMarkerClick ? onMarkerClick(features[j]) : undefined);

		g.append('text')
			.attr('class', 'text')
			.attr('x', x)
			.attr('y', y)
			.attr('dy', '-2%')
			.attr('text-anchor', 'middle')
			.text(count);
	}
};

export const applyGlobeMovementToMarkers = function (d3, svg, projection, path) {
	const markerContainers = svg.selectAll('g.marker-container');

	markerContainers.each(function (d, i) {
		const marker = d3.select(this).select('path.marker');
		const text = d3.select(this).select('text');

		const x = Number.parseFloat(marker.attr('x'));
		const y = Number.parseFloat(marker.attr('y'));
		const lon_lat = [x, y] as any;
		let proj_pos = projection(lon_lat);

		var hasPath =
			path({
				type: 'Point',
				coordinates: lon_lat
				// eslint-disable-next-line
			}) != undefined;

		if (hasPath) {
			marker.style('display', 'inline');
			text.style('display', 'inline');
			text.attr('x', proj_pos[0]);
			text.attr('y', proj_pos[1]);
			marker.attr('transform', 'translate(' + proj_pos[0] + ',' + proj_pos[1] + ')');
		} else {
			marker.style('display', 'none');
			text.style('display', 'none');
		}
	});
};

export const getBoundingBoxMapCoords = function (topLeft: Point, bottomRight: Point, projection, path) {
	const coords2 = projection.invert(topLeft);
	const isTopLeftWithinGlobe =
		path({
			type: 'Point',
			coordinates: coords2
			// eslint-disable-next-line
		}) != undefined;

	const coords3 = projection.invert(bottomRight);
	const isBottomRightWithinGlobe =
		path({
			type: 'Point',
			coordinates: coords3
			// eslint-disable-next-line
		}) != undefined;

	return {
		TopLeft: isTopLeftWithinGlobe
			? {
					x: coords2[0],
					y: coords2[1]
			  }
			: null,
		BottomRight: isBottomRightWithinGlobe
			? {
					x: coords3[0],
					y: coords3[1]
			  }
			: null
	};
};
