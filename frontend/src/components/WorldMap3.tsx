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
	addWorldMapConnections,
	applyWorldMapConnections,
	removeWorldMapConnections,
	drawOnMap,
	applyToDraw,
	removeFromMap,
	defineMarkerFigure,
	applyGlobeMovementToMarkers
} from '../utils/globeStyles';
import '../styles/WorldMap.css';

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
	var scaleIsLow = true;
	var shouldChangeMap = false;

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
			defineMarkerFigure(svg, projection, berlin.features);

			const render = () => {
				if (shouldChangeMap) {
					world = scale <= SCALE_POINT ? worldLow : worldHigh;
					removeWorldMapConnections(svg);
					removeFromMap(svg, 'g#poland-land');
					removeExistingJsonOnGlobe(svg);
					removeGlobeHighlight(svg);
					removeGlobeShading(svg);

					appendedPath = layerJsonOnGlobe(svg, path, world);

					drawOnMap(svg, path, countries, 'poland-land');
					addGlobeHighlight(svg, projection, [width, height]);
					addGlobeShading(svg, projection, [width, height]);
					defineMarkerFigure(svg, projection, berlin.features);
					land = topojson.feature(world, world.objects.land);

					console.log('Maps changes to ', scale <= SCALE_POINT ? 'low' : 'high');
					shouldChangeMap = false;
				}

				appendedPath.attr('d', geoPath(land));

				scaleGlobShadow(svg, projection, [width, height]);
				scaleGlobeBaseColorCircle(svg, projection, [width, height]);
				scaleGlobeHighlight(svg, projection, [width, height]);
				scaleGlobeShading(svg, projection, [width, height]);

				applyToDraw(svg, path, 'g#poland-land');
			};
			render();
			svg.call(
				d3.drag().on('drag', (event) => {
					const rotate = projection.rotate();
					// const SENSITIVITY = scaleIsLow ?
					const k = SENSITIVITY_LOW_RES / projection.scale();
					projection.rotate([rotate[0] + event.dx * k, rotate[1] - event.dy * k]);

					svg.selectAll('.land').attr('d', path);
					applyToDraw(svg, path, 'g#poland-land');

					applyGlobeMovementToMarkers(d3, svg, projection, path);
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
				})
			);
		},
		[worldLow, worldHigh]
	);

	return <div ref={ref}></div>;
};

export default WorldMap3;
