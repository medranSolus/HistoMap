import { Slider } from 'antd';
import React, { useState } from 'react';
import './App.css';
import WorldMap3 from './components/WorldMap3';
import Container from './containers/Container';

function App() {
	let width = 700;
	let height = 600;

	const [selectedYear, setSelectedYear] = useState(1900);

	const handleChange = (value) => setSelectedYear(value);

	return (
		<div className='App'>
			<header className='App-header'>HistoMap</header>
			<Container>
				<div>
					<div className='year-slider-container'>
						<h3>Wybrana data: {selectedYear}</h3>
						<Slider
							className='year-slider'
							min={1900}
							max={2020}
							defaultValue={selectedYear}
							onChange={handleChange}
						/>
					</div>
					<WorldMap3 width={width} height={height} selectedYear={selectedYear} />
				</div>
			</Container>
		</div>
	);
}

export default App;
