import React from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import { default as worldLow } from './world-110m.json';
import { default as worldHigh } from './world-110m.json';
import { default as countries } from './countries.poland.geojson.json';
import { default as berlin } from './stops_berlin.geojson.json';
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
	drawOnMap,
	applyToDraw,
	removeFromMap,
	setMarkersOnMap,
	applyGlobeMovementToMarkers,
	getBoundingBoxMapCoords
} from '../utils/globeStyles';
import '../styles/WorldMap.css';
import { fetchApi } from '../api';

const SCALE_POINT = 1100;
const SENSITIVITY_LOW_RES = 50;

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

	var geoPath = d3.geoPath().projection(projection);
	var path = geoPath.pointRadius(2);

	var scale = 0;
	var shouldChangeMap = false;
	const TOP_LEFT = [100, 100] as [number, number];
	const BOTTOM_RIGHT = [width - 100, height - 100] as [number, number];

	var markers = berlin;
	const ref = useD3(
		(container) => {
			container.selectAll('svg').remove();

			let svg = container.append('svg').attr('width', width).attr('height', height);

			let world = scale <= SCALE_POINT ? worldLow : worldHigh;

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

			// drawOnMap(svg, path, berlin, 'berlin');
			setMarkersOnMap(svg, projection, markers.features);
			console.log(markers);

			const rect = svg
				.append('rect')
				.attr('x', TOP_LEFT[0])
				.attr('y', TOP_LEFT[1])
				.attr('width', BOTTOM_RIGHT[0] - TOP_LEFT[0])
				.attr('height', BOTTOM_RIGHT[1] - TOP_LEFT[1])
				.attr('stroke', 'red')
				.attr('fill', 'transparent');

			const render = () => {
				if (shouldChangeMap) {
					world = scale <= SCALE_POINT ? worldLow : worldHigh;
					// removeWorldMapConnections(svg);
					removeFromMap(svg, 'g#poland-land');
					removeExistingJsonOnGlobe(svg);
					removeGlobeHighlight(svg);
					removeGlobeShading(svg);

					appendedPath = layerJsonOnGlobe(svg, path, world);

					drawOnMap(svg, path, countries, 'poland-land');
					addGlobeHighlight(svg, projection, [width, height]);
					addGlobeShading(svg, projection, [width, height]);
					setMarkersOnMap(svg, projection, markers.features);
					console.log(markers);
					land = topojson.feature(world, world.objects.land);

					// console.log('Maps changes to ', scale <= SCALE_POINT ? 'low' : 'high');
					shouldChangeMap = false;
				}

				appendedPath.attr('d', geoPath(land));

				scaleGlobShadow(svg, projection, [width, height]);
				scaleGlobeBaseColorCircle(svg, projection, [width, height]);
				scaleGlobeHighlight(svg, projection, [width, height]);
				scaleGlobeShading(svg, projection, [width, height]);

				applyToDraw(svg, path, 'g#poland-land');
				rect.raise();
			};

			render();
			svg.call(
				d3
					.drag()
					.on('drag', (event) => {
						const rotate = projection.rotate();

						const k = SENSITIVITY_LOW_RES / projection.scale();
						projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);

						svg.selectAll('.land').attr('d', path);
						applyToDraw(svg, path, 'g#poland-land');

						applyGlobeMovementToMarkers(d3, svg, projection, path);
					})
					.on('end', function () {
						fetchApi(getBoundingBoxMapCoords(TOP_LEFT, BOTTOM_RIGHT, projection, path)).then((res) => {
							markers = res;
							setMarkersOnMap(svg, projection, markers.features);
						});
					})
			).call(
				d3.zoom().on('zoom', (event) => {
					const SCALE = initialScale * event.transform.k;
					projection.scale(SCALE);

					applyGlobeMovementToMarkers(d3, svg, projection, path);

					shouldChangeMap =
						(scale <= SCALE_POINT && SCALE > SCALE_POINT) ||
						(scale > SCALE_POINT && SCALE <= SCALE_POINT) ||
						true;
					scale = SCALE;
					render();
					fetchApi(getBoundingBoxMapCoords(TOP_LEFT, BOTTOM_RIGHT, projection, path)).then((res) => {
						markers = res;
						setMarkersOnMap(svg, projection, markers.features);
					});
				})
			);
		},
		[worldLow, worldHigh, markers]
	);

	return <div ref={ref}></div>;
};

export default WorldMap3;
