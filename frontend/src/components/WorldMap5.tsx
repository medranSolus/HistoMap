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
	applyGlobeMovementToMarkers,
	wrap
} from '../utils/globeStyles';
import '../styles/WorldMap.css';
import { fetchApi } from '../api';
import { drawPoint, drawRect } from '../utils/d3.utilities';
import { svg } from 'd3';

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

function applyModalTranslation(modal, projection, { longitude, latitude }) {
	const [x, y] = projection([longitude, latitude]);
	modal.attr('transform', 'translate(' + x + ',' + y + ')');
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

	const handleMarkerClick = function (svg: any, projection, feature) {
		// {
		// 	"geometry": {
		// 		"type": "Point",
		// 		"coordinates": { "longitude": 13.4, "latitude": 42.35 }
		// 	},
		// 	"type": "Feature",
		// 	"properties": {
		// 		"count": 9,
		// 		"name": "Wiebestr./Huttenstr. (Berlin)"
		// 	}
		// }
		svg = svg as d3.Selection<SVGSVGElement, any, any, any>;
		const { longitude, latitude } = feature.geometry.coordinates;

		svg.selectAll('g.window').remove();
		console.log(feature);
		console.log('open');
		const modal = svg.append('g').attr('class', 'window').attr('x', longitude).attr('y', latitude);

		const baseX = 50,
			baseY = -50,
			textHeight = 18.4;
		let offsetY = textHeight,
			offsetX = 5;
		modal
			.append('rect')
			.attr('class', 'rectangle-container')
			.attr('width', 200)
			.attr('height', 300)
			// .attr('x', function () {
			// 	return 12;
			// })
			// .attr('y', function () {
			// 	return 12;
			// })
			.attr('fill', 'white')
			.attr('transform', `translate(${baseX},${baseY})`);

		modal
			.append('text')
			.text(feature.books[0].name)
			.attr('transform', `translate(${baseX + offsetX},${baseY + offsetY})`);

		let previousTextSpan = 0;
		for (let i = 0; i < feature.books.length; i++) {
			const book = feature.books[i];
			const text = modal
				.append('text')
				.text(book.title)
				.attr('y', baseY + offsetY + textHeight + 15)
				.attr('dy', 0)
				.call(wrap(d3), 180)
				.attr('transform', `translate(${baseX + offsetX},${baseY + offsetY + textHeight + previousTextSpan})`);

			const tspanCount = text.selectAll('tspan').size();

			previousTextSpan = tspanCount * 18.4;
		}

		applyModalTranslation(modal, projection, { longitude, latitude });
	};

	const fetchMarkers = (container) => {
		const BoundingBox = getBoundingBoxMapCoords(TOP_LEFT, BOTTOM_RIGHT, projection, path);

		fetchApi({
			BoundingBox,
			Year: selectedYear,
			Filters: filters,
			Radius: Number.parseInt(projection.scale().toString())
		}).then((res) => {
			markers = res;
			// const handleMarkerClick = (feature) => () => setSelectedMarker(feature);
			setMarkersOnMap(container, projection, markers.features, handleMarkerClick);
			container.select('g.window').raise();
		});
	};

	useEffect(() => {
		projection.fitExtent([TOP_LEFT, BOTTOM_RIGHT], poland1715GeoJSON as any);
	}, []);

	var markers = { features: [] };
	const ref = useD3(
		(container) => {
			container.selectAll('svg').remove();
			let svg = container
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.on('click', () => {
					svg.selectAll('.window').remove();
					console.log('close');
				});
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
			setMarkersOnMap(g, projection, markers.features, handleMarkerClick);

			let rect;
			if (displayActiveRegion) {
				rect = drawRect(g, TOP_LEFT, BOTTOM_RIGHT);
				//@ts-ignore
				drawPoint(g, CENTER_OF_SCREEN);
			}

			const render = () => {
				appendedPath.attr('d', geoPath(land));
				applyToDraw(g, path, 'g#poland-land');
				const modal = svg.select('g.window');
				if (!modal.empty()) {
					const longitude = modal.attr('x');
					const latitude = modal.attr('y');
					applyModalTranslation(modal, projection, { longitude, latitude });
				}

				if (displayActiveRegion) rect.raise();
				applyGlobeMovementToMarkers(d3, svg, projection, path);
			};
			render();

			const zoom = d3
				.zoom()
				// .scaleExtent([1, 8])
				.on('zoom', function (e) {
					// console.log(d3.select(this).datum());
					let t = e.transform; // get current zoom state
					// console.log(t.k, t.x, t.y);
					projection.scale(t.k * SCALE_POINT).translate([t.x, t.y]); // set scale and translate of projection.
					render();
				})
				.on('end', function () {
					console.log('zoom-end');
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
