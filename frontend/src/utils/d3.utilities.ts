type CoordinateArray = [number, number];

export const drawRect = function (selection, TOP_LEFT: CoordinateArray, BOTTOM_RIGHT: CoordinateArray) {
	return selection
		.append('rect')
		.attr('x', TOP_LEFT[0])
		.attr('y', TOP_LEFT[1])
		.attr('width', BOTTOM_RIGHT[0] - TOP_LEFT[0])
		.attr('height', BOTTOM_RIGHT[1] - TOP_LEFT[1])
		.attr('stroke', 'red')
		.attr('fill', 'transparent');
};

export const drawPoint = function (selection, coords: CoordinateArray) {
	return selection.append('circle').attr('cx', coords[0]).attr('cy', coords[1]).attr('r', 2).attr('fill', 'red');
};
