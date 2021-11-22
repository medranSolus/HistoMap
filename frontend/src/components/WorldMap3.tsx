import React from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import { default as worldLow } from './world-110m.json';
import { default as worldHigh } from './world-50m.json';
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
	scaleGlobeShading,
	removeExistingJsonOnGlobe,
	removeGlobeHighlight,
	removeGlobeShading,
	addWorldMapConnections,
	applyWorldMapConnections,
	removeWorldMapConnections
} from '../utils/globeStyles';
import '../styles/WorldMap.scss';

const SENSITIVITY_LOW_RES = 58;
const SENSITIVITY_HIGH_RES = 58;

const SCALE_POINT = 900;

export interface WorldMap3Props {
	width: number;
	height: number;
}

var links = [
	{
		type: 'LineString',
		coordinates: [
			[15.72899, 50.899],
			[15.50643, 51.93548]
		]
	}
];

const WorldMap3: React.FC<WorldMap3Props> = ({ height, width }) => {
	var projection = d3
		.geoOrthographic()
		.translate([width / 2, height / 2])
		.clipAngle(90)
		.scale(220);

	const initialScale = projection.scale();

	var geoPath = d3.geoPath().projection(projection);
	var path = geoPath.pointRadius(2);

	var scale = 0;
	var scaleIsLow = true;
	var shouldChangeMap = false;

	// worldLow.features.filter(function (d) {
	// 	console.log(d.properties.name);
	// 	return d.properties.name == 'France';
	// });

	const ref = useD3(
		(container) => {
			container.selectAll('svg').remove();

			let svg = container.append('svg').attr('width', width).attr('height', height);

			console.log('Scale', scale);

			let world = scale <= SCALE_POINT ? worldLow : worldHigh;

			// cień rzucany przez kulę
			addGlobeShadow(svg, projection, [width, height]);

			// kolor oceanu
			addSphereOceanColor(svg, projection, [width, height]);

			// nałożenie mapy na glob
			let appendedPath = layerJsonOnGlobe(svg, path, world);

			// imitacja odbijającego się światła
			addGlobeHighlight(svg, projection, [width, height]);

			// shader globu
			addGlobeShading(svg, projection, [width, height]);

			let land = topojson.feature(world, world.objects.land);

			addWorldMapConnections(svg, path, links);

			const render = () => {
				if (shouldChangeMap) {
					world = scale <= SCALE_POINT ? worldLow : worldHigh;
					removeWorldMapConnections(svg);
					removeExistingJsonOnGlobe(svg);
					removeGlobeHighlight(svg);
					removeGlobeShading(svg);

					appendedPath = layerJsonOnGlobe(svg, path, world);

					addGlobeHighlight(svg, projection, [width, height]);
					addGlobeShading(svg, projection, [width, height]);
					addWorldMapConnections(svg, path, links);

					land = topojson.feature(world, world.objects.land);

					console.log('Maps changes to ', scale <= SCALE_POINT ? 'low' : 'high');
					shouldChangeMap = false;
				}

				appendedPath.attr('d', geoPath(land));
				scaleGlobShadow(svg, projection, [width, height]);
				scaleGlobeBaseColorCircle(svg, projection, [width, height]);
				scaleGlobeHighlight(svg, projection, [width, height]);
				scaleGlobeShading(svg, projection, [width, height]);

				applyWorldMapConnections(svg, path);
			};
			render();
			svg.call(
				d3.drag().on('drag', (event) => {
					const rotate = projection.rotate();
					// const SENSITIVITY = scaleIsLow ?
					const k = SENSITIVITY_LOW_RES / projection.scale();
					projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);
					render();
				})
			).call(
				d3.zoom().on('zoom', (event) => {
					const SCALE = initialScale * event.transform.k;
					projection.scale(SCALE);
					shouldChangeMap =
						(scale <= SCALE_POINT && SCALE > SCALE_POINT) || (scale > SCALE_POINT && SCALE <= SCALE_POINT);
					scale = SCALE;
					render();
				})
			);
		},
		[worldLow, worldHigh]
	);

	return <div ref={ref}></div>;
};

export default WorldMap3;
