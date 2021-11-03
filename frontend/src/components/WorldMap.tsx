import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import useD3 from '../common/useD3';
import '../styles/WorldMap.scss';
import { setInterval } from 'timers';

export interface WorldMapProps {}

const getGetData = () => {
	return new Promise((resolve, reject) => {
		try {
			d3.json(
				'https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json'
			).then(function (json) {
				resolve(json);
			});
		} catch (error) {
			reject(error);
		}
	});
};

const WorldMap: React.FC<WorldMapProps> = () => {
	const [geojson, setGeojson] = useState<any>(null);

	const height = 720;
	const width = 1280;
	let yaw = 300;
	let scale = 1;

	// wybranie projekcji mapy, skali i jej orbotu
	let projection = d3
		.geoOrthographic()
		.scale(300)
		.translate([width / 2, height / 2])
		.clipAngle(90)
		.precision(10);

	// wygenerowanie siatki geograficznej na kuli;
	let graticule = d3.geoGraticule();

	const ref = useD3(
		(container) => {
			if (geojson) {
				init(container);
			}
		},
		[geojson]
	);

	useEffect(() => {
		getGetData()
			.then((data) => {
				setGeojson(data);
			})
			.catch((err) => console.error(err));
	}, []);

	const init = (container) => {
		setInterval(() => {
			update(container);
		}, 100);
	};

	const update = (container: d3.Selection<any, any, any, any>) => {
		// obrót mapy
		projection.rotate([yaw, -45]);

		// wygenerowanie ścieżki svg i nałożenie na niej projekcji mapy
		let path = d3.geoPath().projection(projection);

		// usunięcie poprzedniej mapy jesli jest
		container.select('svg').remove();

		// dodanie nowej mapy
		let svg = container.append('svg').style('width', width).style('height', height);

		// narysowanie lądów na mapie
		svg.append('g')
			.selectAll('path')
			.data(geojson.features)
			.join('path')
			//@ts-ignore
			.attr('d', path)
			.attr('fill', 'darkgrey')
			.attr('stroke', 'darkgrey');

		// narysowanie siatki na mapie
		svg.append('path').datum(graticule).attr('class', 'graticule').attr('d', path);

		svg.on('wheel', function (e) {
			e.preventDefault();

			scale += e.deltaY * -0.1;

			// narzut przedziału Min Max
			scale = Math.min(Math.max(300, scale), 1000);

			projection.scale(scale);
		});

		yaw -= 0.2;
	};

	return (
		<div
			ref={ref}
			style={{
				height: 500,
				width: '100%',
				marginRight: '0px',
				marginLeft: '0px'
			}}
		></div>
	);
};

export default WorldMap;
