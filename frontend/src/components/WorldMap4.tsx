import React, { useState } from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import { default as worldLow } from './world-110m.json';
import { default as worldHigh } from './world-110m.json';
import { default as countries } from '../data/world_1945.poland.geojson.json';
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
const rotate = 90;
const maxlat = 83;

var cnt = 0;

export interface WorldMap3Props {
	width: number;
	height: number;
	selectedYear: number;
}

function mercatorBounds(projection, maxlat) {
	var yaw = projection.rotate()[0],
		xymax = projection([-yaw + 180 - 1e-6, -maxlat]),
		xymin = projection([-yaw - 180 + 1e-6, maxlat]);

	return [xymin, xymax];
}

const WorldMap4: React.FC<WorldMap3Props> = ({ height, width, selectedYear }) => {
	const CENTER_OF_SCREEN = [width / 2, height / 2] as [number, number];
	var projection = d3.geoMercator().rotate([rotate, 0]).translate(CENTER_OF_SCREEN).scale(165);

	const initialScale = projection.scale();

	var geoPath = d3.geoPath().projection(projection);
	var path = geoPath.pointRadius(2);

	var scale = 0;
	const TOP_LEFT = [100, 100] as [number, number];
	const BOTTOM_RIGHT = [width - 100, height - 100] as [number, number];
	const [selectedMarker, setSelectedMarker] = useState(null);

	const fetchMarkers = (container) => {
		const BoundingBox = getBoundingBoxMapCoords(TOP_LEFT, BOTTOM_RIGHT, projection, path);

		fetchApi({
			BoundingBox,
			Year: selectedYear
		}).then((res) => {
			markers = res;
			const handleMarkerClick = (feature) => () => setSelectedMarker(feature);
			setMarkersOnMap(container, projection, markers.features, handleMarkerClick);
		});
	};

	var markers = { features: [] };
	const ref = useD3(
		(container) => {
			container.selectAll('svg').remove();

			let svg = container.append('svg').attr('width', width).attr('height', height);

			fetchMarkers(svg);

			let world = scale <= SCALE_POINT ? worldLow : worldHigh;

			// nałożenie mapy na glob
			let appendedPath = layerJsonOnGlobe(svg, path, world);

			// nałożenie obszaru polski na mapę
			drawOnMap(svg, path, countries, 'poland-land');

			let land = topojson.feature(world, world.objects.land);

			// drawOnMap(svg, path, berlin, 'berlin');
			setMarkersOnMap(svg, projection, markers.features);

			const rect = svg
				.append('rect')
				.attr('x', TOP_LEFT[0])
				.attr('y', TOP_LEFT[1])
				.attr('width', BOTTOM_RIGHT[0] - TOP_LEFT[0])
				.attr('height', BOTTOM_RIGHT[1] - TOP_LEFT[1])
				.attr('stroke', 'red')
				.attr('fill', 'transparent');
			const point = svg
				.append('circle')
				.attr('cx', CENTER_OF_SCREEN[0])
				.attr('cy', CENTER_OF_SCREEN[1])
				.attr('r', 2)
				.attr('fill', 'red');

			const render = () => {
				appendedPath.attr('d', geoPath(land));

				applyToDraw(svg, path, 'g#poland-land');
				rect.raise();
			};

			render();

			// .on('zoom', (event) => {

			// });
			svg.call(
				d3
					.drag()
					.on('drag', ({ x, y, dx, dy }) => {
						const [lastX, lastY] = projection.translate();
						projection.translate([lastX + dx, lastY + dy]);
						applyGlobeMovementToMarkers(d3, svg, projection, path);
						render();
					})
					.on('end', function () {
						fetchMarkers(svg);
					})
			).call(
				d3
					.zoom()
					.scaleExtent([1, Infinity])
					.translateExtent([
						[0, 0],
						[width, height]
					])
					.extent([
						[0, 0],
						[width, height]
					])
					.on('zoom', (event) => {
						svg.select('path').attr('transform', event.transform);
						projection(event.transform);
						// fetchMarkers(svg);
					})
			);
		},
		[worldLow, worldHigh, markers, selectedMarker]
	);
	return (
		<>
			<div ref={ref}></div>
			<div>{selectedMarker && JSON.stringify(selectedMarker)}</div>
		</>
	);
};

export default WorldMap4;
