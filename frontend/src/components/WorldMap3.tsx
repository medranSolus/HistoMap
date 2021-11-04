import React, { useEffect } from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import { default as world } from './world-110m.json';
import useD3 from '../common/useD3';
export interface WorldMap3Props {}
let width = 960;
let height = 500;
const sensitivity = 58;

const WorldMap3: React.FC<WorldMap3Props> = ({}) => {
	var projection = d3
		.geoOrthographic()
		.translate([width / 2, height / 2])
		.clipAngle(90)
		.scale(220);

	const initialScale = projection.scale();

	var sky = d3
		.geoOrthographic()
		.translate([width / 2, height / 2])
		.clipAngle(90)
		.scale(300);

	// var path = d3.geoPath().projection(projection).pointRadius(2);
	var geoPath = d3.geoPath().projection(projection);
	var path = geoPath.pointRadius(2);

	useEffect(() => {}, []);

	var links = [],
		arcLines = [];

	const ref = useD3(
		(container) => {
			container.selectAll('svg').remove();
			let svg = container.append('svg').attr('width', width).attr('height', height);
			// svg.on('mousedown', mousedown);
			// d3.select(window).on('mousemove', mousemove).on('mouseup', mouseup);

			var ocean_fill = svg
				.append('defs')
				.append('radialGradient')
				.attr('id', 'ocean_fill')
				.attr('cx', '75%')
				.attr('cy', '25%');
			ocean_fill.append('stop').attr('offset', '5%').attr('stop-color', '#fff');
			ocean_fill.append('stop').attr('offset', '100%').attr('stop-color', '#ababab');

			var globe_highlight = svg
				.append('defs')
				.append('radialGradient')
				.attr('id', 'globe_highlight')
				.attr('cx', '75%')
				.attr('cy', '25%');
			globe_highlight.append('stop').attr('offset', '5%').attr('stop-color', '#ffd').attr('stop-opacity', '0.6');
			globe_highlight
				.append('stop')
				.attr('offset', '100%')
				.attr('stop-color', '#ba9')
				.attr('stop-opacity', '0.2');

			var globe_shading = svg
				.append('defs')
				.append('radialGradient')
				.attr('id', 'globe_shading')
				.attr('cx', '55%')
				.attr('cy', '45%');
			globe_shading.append('stop').attr('offset', '30%').attr('stop-color', '#fff').attr('stop-opacity', '0');
			globe_shading
				.append('stop')
				.attr('offset', '100%')
				.attr('stop-color', '#505962')
				.attr('stop-opacity', '0.3');

			var drop_shadow = svg
				.append('defs')
				.append('radialGradient')
				.attr('id', 'drop_shadow')
				.attr('cx', '50%')
				.attr('cy', '50%');
			drop_shadow.append('stop').attr('offset', '20%').attr('stop-color', '#000').attr('stop-opacity', '.5');
			drop_shadow.append('stop').attr('offset', '100%').attr('stop-color', '#000').attr('stop-opacity', '0');

			svg.append('ellipse')
				.attr('cx', 440)
				.attr('cy', 450)
				.attr('rx', projection.scale() * 0.9)
				.attr('ry', projection.scale() * 0.25)
				.attr('class', 'noclicks')
				.style('fill', 'url(#drop_shadow)');

			svg.append('circle')
				.attr('cx', width / 2)
				.attr('cy', height / 2)
				.attr('r', projection.scale())
				.attr('class', 'noclicks')
				.style('fill', 'url(#ocean_fill)');

			const appendedPath = svg
				.append('path')
				.datum(topojson.feature(world, world.objects.land))
				.attr('class', 'land noclicks')
				.attr('d', path);

			svg.append('circle')
				.attr('cx', width / 2)
				.attr('cy', height / 2)
				.attr('r', projection.scale())
				.attr('class', 'noclicks')
				.style('fill', 'url(#globe_highlight)');

			svg.append('circle')
				.attr('cx', width / 2)
				.attr('cy', height / 2)
				.attr('r', projection.scale())
				.attr('class', 'noclicks')
				.style('fill', 'url(#globe_shading)');

			links.forEach(function (e, i, a) {
				var feature = { type: 'Feature', geometry: { type: 'LineString', coordinates: [e.source, e.target] } };
				arcLines.push(feature);
			});

			svg.append('g')
				.attr('class', 'arcs')
				.selectAll('path')
				.data(arcLines)
				.enter()
				.append('path')
				.attr('class', 'arc')
				.attr('d', path);

			// refresh(svg);
			const land = topojson.feature(world, world.objects.land);
			const render = () => appendedPath.attr('d', geoPath(land));
			render();
			svg.call(
				d3.drag().on('drag', (event) => {
					const rotate = projection.rotate();
					const k = sensitivity / projection.scale();
					projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
					render();
				})
			).call(
				d3.zoom().on('zoom', (event) => {
					projection.scale(initialScale * event.transform.k);
					render();
				})
			);
		},
		[world]
	);

	function refresh(svg) {
		svg.selectAll('.land').attr('d', path);
		svg.selectAll('.point').attr('d', path);
	}

	var m0, o0;
	// const mousedown = function (event) {
	// 	console.log('mousedown');

	// 	m0 = [event.pageX, event.pageY];
	// 	o0 = projection.rotate();
	// 	event.preventDefault();
	// };
	// const mousemove = function (event) {
	// 	if (m0) {
	// 		let m1 = [event.pageX, event.pageY];
	// 		let o1: [number, number] = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
	// 		o1[1] = o1[1] > 30 ? 30 : o1[1] < -30 ? -30 : o1[1];
	// 		projection.rotate(o1);
	// 		sky.rotate(o1);
	// 		refresh(d3.select('svg'));
	// 	}
	// };
	// const mouseup = function (event) {
	// 	if (m0) {
	// 		mousemove(event);
	// 		m0 = null;
	// 	}
	// };

	return (
		<>
			<div ref={ref}></div>
		</>
	);
};

export default WorldMap3;
