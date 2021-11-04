import React from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import { default as world } from './world-110m.json';
import { eulerAngles } from '../utils/mathGeo.utils';
import useD3 from '../common/useD3';
export interface WorldMap2Props {}

const WorldMap2: React.FC<WorldMap2Props> = ({}) => {
	let width = 960;
	let height = 500;
	let r = 250;

	let projection = d3
		.geoMercator()
		.scale(250)
		.translate([width / 2, height / 2])
		.clipAngle(90);

	const ref = useD3(
		(container) => {
			container.selectAll('svg').remove();
			let path = d3.geoPath().projection(projection);

			let svg = container.append('svg').attr('width', width).attr('height', height);

			let dragHandler = d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);

			svg.call(dragHandler);

			let gpos0, o0;

			function dragstarted(e) {
				if (projection) {
					gpos0 = projection.invert(d3.pointer(e));
					o0 = projection.rotate();

					// dodanie kropki
					// svg.insert('path')
					// 	.datum({ type: 'Point', coordinates: gpos0 })
					// 	.attr('d', path)
					// 	.attr('class', 'point');
				}
			}

			function dragged(e) {
				let gpos1 = projection.invert(d3.pointer(e));

				o0 = projection.rotate();

				let o1 = eulerAngles(gpos0, gpos1, o0);

				projection.rotate(o1);

				svg.selectAll('.point').datum({ type: 'Point', coordinates: gpos1 });
				svg.selectAll('path').attr('d', path);
			}

			function dragended() {
				svg.selectAll('.point').remove();
			}

			svg.append('path').datum(topojson.feature(world, world.objects.land)).attr('class', 'land').attr('d', path);
			let borders = topojson.mesh(world, world.objects.countries, function (a, b) {
				return a !== b;
			});
			svg.append('path').datum(borders).attr('class', 'border').attr('d', path);
		},
		[world]
	);
	return (
		<>
			<div ref={ref}></div>
		</>
	);
};

export default WorldMap2;
