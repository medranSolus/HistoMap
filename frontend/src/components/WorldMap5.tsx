import React, { useEffect, useState } from 'react';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import { default as worldLow } from './world-110m.json';
import { default as worldHigh } from './world-110m.json';
import { default as poland1945GeoJSON } from '../data/world_1945.poland.geojson.json';
import { default as poland1920GeoJSON } from '../data/world_1920.poland.geojson.json';
import { default as poland1715GeoJSON } from '../data/world_1715.poland.geojson.json';
import { default as berlin } from './stops_berlin.geojson.json';
import useD3 from '../common/useD3';
import {
	layerJsonOnGlobe,
	drawOnMap,
	applyToDraw,
	setMarkersOnMap,
	getBoundingBoxMapCoords,
	applyGlobeMovementToMarkers
} from '../utils/globeStyles';
import '../styles/WorldMap.css';
import { fetchApi } from '../api';
import { drawPoint, drawRect } from '../utils/d3.utilities';

const SCALE_POINT = 1100;

interface Transformation {
	k: number;
	x: number;
	y: number;
}

export interface WorldMap5Props {
	width: number;
	height: number;
	selectedYear: number;
	filters: number[];
	displayActiveRegion?: boolean;
}

const WorldMap5: React.FC<WorldMap5Props> = ({ height, width, selectedYear, filters, displayActiveRegion }) => {
	const CENTER_OF_SCREEN = [width / 2, height / 2] as [number, number];
	const projection = d3.geoMercator().translate([563, 430]);
	// .scale(SCALE_POINT * 0.15)

	var geoPath = d3.geoPath().projection(projection);
	var path = geoPath.pointRadius(2);

	var scale = 0;
	const TOP_LEFT = (displayActiveRegion ? [100, 100] : [0, 0]) as [number, number];
	const BOTTOM_RIGHT = (displayActiveRegion ? [width - 100, height - 100] : [width, height]) as [number, number];
	const [selectedMarker, setSelectedMarker] = useState(null);

	const fetchMarkers = (container) => {
		const BoundingBox = getBoundingBoxMapCoords(TOP_LEFT, BOTTOM_RIGHT, projection, path);

		fetchApi({
			BoundingBox,
			Year: selectedYear,
			Filters: filters,
			Radius: Number.parseInt(projection.scale().toString())
		}).then((res) => {
			markers = berlin;
			const handleMarkerClick = (feature) => () => setSelectedMarker(feature);
			setMarkersOnMap(container, projection, markers.features, handleMarkerClick);
		});
	};

	useEffect(() => {
		projection.fitExtent([TOP_LEFT, BOTTOM_RIGHT], poland1715GeoJSON as any);
	}, []);

	var markers = { features: [] };
	const ref = useD3(
		(container) => {
			container.selectAll('svg').remove();
			let svg = container.append('svg').attr('width', width).attr('height', height);
			let g = svg.append('g');

			fetchMarkers(g);
			let world = scale <= SCALE_POINT ? worldLow : worldHigh;

			// nałożenie mapy na glob
			let appendedPath = layerJsonOnGlobe(g, path, world);

			// nałożenie obszaru polski na mapę
			let polandGeoJSON;
			let polandLandColor;
			let polandLandStroke = null;
			switch (true) {
				case selectedYear >= 1945:
					polandGeoJSON = poland1945GeoJSON;
					polandLandColor = 'black';
					polandLandStroke = null;
					break;
				case selectedYear < 1945 && selectedYear >= 1920:
					polandGeoJSON = poland1920GeoJSON;
					polandLandColor = 'black';
					polandLandStroke = null;
					break;
				case selectedYear >= 1900:
					polandGeoJSON = poland1715GeoJSON;
					polandLandColor = '#999999';
					polandLandStroke = '#636363';
					break;
				default:
					polandGeoJSON = poland1945GeoJSON;
					polandLandColor = 'black';
					break;
			}
			drawOnMap(g, path, polandGeoJSON, 'poland-land', polandLandColor, polandLandStroke);
			let land = topojson.feature(world, world.objects.land);

			// drawOnMap(svg, path, berlin, 'berlin');
			setMarkersOnMap(g, projection, markers.features);

			let rect;
			if (displayActiveRegion) {
				rect = drawRect(g, TOP_LEFT, BOTTOM_RIGHT);
				//@ts-ignore
				drawPoint(g, CENTER_OF_SCREEN);
			}

			const render = () => {
				appendedPath.attr('d', geoPath(land));
				applyToDraw(g, path, 'g#poland-land');
				if (displayActiveRegion) rect.raise();
				applyGlobeMovementToMarkers(d3, svg, projection, path);
			};
			render();

			const zoom = d3
				.zoom()
				// .scaleExtent([1, 8])
				.on('zoom', function (e) {
					let t = e.transform; // get current zoom state
					// console.log(t.k, t.x, t.y);
					projection.scale(t.k * SCALE_POINT).translate([t.x, t.y]); // set scale and translate of projection.
					render();
				})
				.on('end', function () {
					fetchMarkers(g);
				});

			svg.call(zoom);
		},
		[worldLow, worldHigh, selectedYear]
	);
	return (
		<>
			<div className='svg-container' ref={ref}></div>
			<div>{selectedMarker && JSON.stringify(selectedMarker)}</div>
		</>
	);
};

export default WorldMap5;
