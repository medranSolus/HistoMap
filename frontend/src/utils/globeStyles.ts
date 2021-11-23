import * as topojson from 'topojson-client';

export const addGlobeShadow = function (svg, projection, [width, height]: [number, number]) {
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

export const addGlobeBaseColor = function (svg, projection, [width, height]: [number, number]) {
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

export const addGlobeHighlight = function (svg, projection, [width, height]: [number, number]) {
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

export const addGlobeShading = function (svg, projection, [width, height]: [number, number]) {
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

export const scaleGlobeShading = function (svg, projection, [width, height]: [number, number]) {
	svg.select('circle#globe_shading_circle').attr('r', projection.scale());
};

export const removeGlobeShading = function (svg) {
	svg.select('#globe_shading_circle').remove();
};

export const layerJsonOnGlobe = function (svg, path, world) {
	return svg
		.append('path')
		.datum(topojson.feature(world, world.objects.land))
		.attr('class', 'land noclicks')
		.attr('d', path);
};

export const removeExistingJsonOnGlobe = function (svg: d3.Selection<SVGSVGElement, any, any, any>) {
	svg.select('path.land').remove();
};

export const addWorldMapConnections = function (svg, path, data) {
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
	);
};

export const applyWorldMapConnections = function (svg, path) {
	svg.selectAll('.arcs > path.arc').attr('d', path);
};

export const removeWorldMapConnections = function (svg) {
	svg.selectAll('.arcs > path.arc');
};

export const drawOnMap = function (svg: d3.Selection<SVGSVGElement, any, any, any>, path, data, id) {
	const g = svg.append('g');

	g.attr('id', id);
	g.selectAll('path').data(data.features).enter().append('path').attr('d', path).style('fill', 'black');
};

export const applyToDraw = function (svg: d3.Selection<SVGSVGElement, any, any, any>, path, id) {
	svg.select(`g#${id}`).selectAll('path').attr('d', path);
};

export const removeFromMap = function (svg, id) {
	svg.select(`g#${id}`).remove();
};
