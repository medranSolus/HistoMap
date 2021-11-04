import React from 'react';
import useD3 from '../common/useD3';
import { default as world } from './world-110m.json';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';

const HEIGHT = 500;
const WIDTH = 960;

export interface WorldMap4Props {}

const WorldMap4: React.FC<WorldMap4Props> = ({}) => {
	const ref = useD3((container) => {
		const svg = container.append('svg').attr('width', WIDTH).attr('height', HEIGHT);
		const path = svg.append('path');
		const projection = d3.geoOrthographic();
		const initialScale = projection.scale();
		const geoPath = d3.geoPath().projection(projection);
		const pathRadius = geoPath.pointRadius(2);
		const sensitivity = 58;

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
		globe_highlight.append('stop').attr('offset', '100%').attr('stop-color', '#ba9').attr('stop-opacity', '0.2');

		var globe_shading = svg
			.append('defs')
			.append('radialGradient')
			.attr('id', 'globe_shading')
			.attr('cx', '55%')
			.attr('cy', '45%');
		globe_shading.append('stop').attr('offset', '30%').attr('stop-color', '#fff').attr('stop-opacity', '0');
		globe_shading.append('stop').attr('offset', '100%').attr('stop-color', '#505962').attr('stop-opacity', '0.3');

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
			.attr('cx', WIDTH / 2)
			.attr('cy', HEIGHT / 2)
			.attr('r', projection.scale())
			.attr('class', 'noclicks')
			.style('fill', 'url(#ocean_fill)');

		svg.append('path')
			.datum(topojson.feature(world, world.objects.land))
			.attr('class', 'land noclicks')
			.attr('d', pathRadius);

		svg.append('circle')
			.attr('cx', WIDTH / 2)
			.attr('cy', HEIGHT / 2)
			.attr('r', projection.scale())
			.attr('class', 'noclicks')
			.style('fill', 'url(#globe_highlight)');

		svg.append('circle')
			.attr('cx', WIDTH / 2)
			.attr('cy', HEIGHT / 2)
			.attr('r', projection.scale())
			.attr('class', 'noclicks')
			.style('fill', 'url(#globe_shading)');

		const land = topojson.feature(world, world.objects.land);
		const render = () => path.attr('d', geoPath(land));
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
	}, []);

	return (
		<>
			<div ref={ref}></div>
		</>
	);
};

export default WorldMap4;
