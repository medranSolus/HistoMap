import React, { useEffect } from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import { default as world } from './world-110m.json';
import useD3 from '../common/useD3';
import {
	addGlobeShadow,
	addGlobeBaseColor as addSphereOceanColor,
	addGlobeHighlight,
	addGlobeShading,
	layerJsonOnGlobe,
	scaleGlobShadow,
	scaleGlobeBaseColorCircle,
	scaleGlobeHighlight,
	scaleGlobeShading
} from '../utils/globeStyles';

const sensitivity = 58;

export interface WorldMap3Props {
	width: number;
	height: number;
}

const WorldMap3: React.FC<WorldMap3Props> = ({ height, width }) => {
	var projection = d3
		.geoOrthographic()
		.translate([width / 2, height / 2])
		.clipAngle(90)
		.scale(220);

	const initialScale = projection.scale();

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

			// cień rzucany przez kulę
			addGlobeShadow(svg, projection, [width, height]);

			// kolor oceanu
			addSphereOceanColor(svg, projection, [width, height]);

			// nałożenie mapy na glob
			const appendedPath = layerJsonOnGlobe(svg, path, world);

			// imitacja odbijającego się światła
			addGlobeHighlight(svg, projection, [width, height]);

			// shader globu
			addGlobeShading(svg, projection, [width, height]);

			links.forEach(function (e, i, a) {
				var feature = { type: 'Feature', geometry: { type: 'LineString', coordinates: [e.source, e.target] } };
				arcLines.push(feature);
			});

			const land = topojson.feature(world, world.objects.land);
			const render = () => {
				appendedPath.attr('d', geoPath(land));
				scaleGlobShadow(svg, projection, [width, height]);
				scaleGlobeBaseColorCircle(svg, projection, [width, height]);
				scaleGlobeHighlight(svg, projection, [width, height]);
				scaleGlobeShading(svg, projection, [width, height]);
			};
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

	return <div ref={ref}></div>;
};

export default WorldMap3;
