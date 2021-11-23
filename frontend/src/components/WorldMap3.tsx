import React from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import { default as worldLow } from './world-110m.json';
import { default as worldHigh } from './world-50m.json';
import { default as countries } from './countries.geojson.json';
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
	removeWorldMapConnections,
	drawOnMap,
	applyToDraw,
	removeFromMap
} from '../utils/globeStyles';
import '../styles/WorldMap.scss';

const SENSITIVITY_LOW_RES = 58;

const SCALE_POINT = 1100;

export interface WorldMap3Props {
	width: number;
	height: number;
}

const POLAND_COORDS = [21.017532, 52.237049];

var links = [
	{
		name: 'blabla1',
		type: 'LineString',
		coordinates: [
			// [Longitude Latitude]
			[12.72899, 48],
			POLAND_COORDS,
			[13.4, 42.35]
		]
	},
	{
		type: 'LineString',
		name: 'blabla2',
		coordinates: [POLAND_COORDS, [2.35, 48.866667]]
	},
	{
		type: 'LineString',
		coordinates: [POLAND_COORDS, [-153.369141, 66.160507]]
	},
	{
		type: 'LineString',
		coordinates: [POLAND_COORDS, [-73.935242, 40.73061]]
	},
	{
		type: 'LineString',
		coordinates: [POLAND_COORDS, [182.983333, 1.325556]]
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

	const ref = useD3(
		(container) => {
			container.selectAll('svg').remove();

			let svg = container.append('svg').attr('width', width).attr('height', height);

			let world = scale <= SCALE_POINT ? worldLow : worldHigh;

			// odfiltrowanie krajów innych niż polska
			countries.features = countries.features.filter((c) => c.id === 'POL');

			// cień rzucany przez kulę
			addGlobeShadow(svg, projection, [width, height]);

			// kolor oceanu
			addSphereOceanColor(svg, projection, [width, height]);

			// nałożenie mapy na glob
			let appendedPath = layerJsonOnGlobe(svg, path, world);

			// nałożenie obszaru polski na mapę
			drawOnMap(svg, path, countries, 'poland-land');

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
					removeFromMap(svg, 'poland-land');
					removeExistingJsonOnGlobe(svg);
					removeGlobeHighlight(svg);
					removeGlobeShading(svg);

					appendedPath = layerJsonOnGlobe(svg, path, world);

					drawOnMap(svg, path, countries, 'poland-land');
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

				applyToDraw(svg, path, 'poland-land');
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
