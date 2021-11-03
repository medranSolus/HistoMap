import React from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import { eulerAngles } from '../utils/mathGeo.utils';
import useD3 from '../common/useD3';
export interface WorldMap2Props {}

const WorldMap2: React.FC<WorldMap2Props> = ({}) => {
	let width = 960;
	let height = 500;
	let r = 250;

	let projection = d3
		.geoOrthographic()
		.scale(250)
		.translate([width / 2, height / 2])
		.clipAngle(90);

	let path = d3.geoPath().projection(projection);

	const ref = useD3((svg) => {
		svg.append('svg').attr('width', width).attr('height', height);

		//@ts-ignore
		let drag = d3.behavior.drag().on('dragstart', dragstarted).on('drag', dragged).on('dragend', dragended);

		svg.call(drag);

		let gpos0, o0;

		function dragstarted() {
			//@ts-ignore
			gpos0 = projection.invert(d3.mouse(this));
			o0 = projection.rotate();

			svg.insert('path').datum({ type: 'Point', coordinates: gpos0 }).attr('d', path).attr('class', 'point');
		}

		function dragged() {
			//@ts-ignore
			let gpos1 = projection.invert(d3.mouse(this));

			o0 = projection.rotate();

			let o1 = eulerAngles(gpos0, gpos1, o0);
			//@ts-ignore
			projection.rotate(o1);

			svg.selectAll('.point').datum({ type: 'Point', coordinates: gpos1 });
			//@ts-ignore
			svg.selectAll('path').attr('d', path);
		}

		function dragended() {
			svg.selectAll('.point').remove();
		}

		d3.json<any>('world-110m.json')
			.then((world) => {
				svg.append('path')
					.datum(topojson.feature(world, world.objects.land))
					.attr('class', 'land')
					.attr('d', path);

				let borders = topojson.mesh(world, world.objects.countries, function (a, b) {
					return a !== b;
				});

				svg.append('path').datum(borders).attr('class', 'border').attr('d', path);
			})
			.catch((err) => {
				throw err;
			});
	}, []);
	return (
		<>
			<div ref={ref}></div>
		</>
	);
};

export default WorldMap2;
