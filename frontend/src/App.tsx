import { Slider, Select, Row, Col } from 'antd';
import React, { useState } from 'react';
import './App.css';
import WorldMap5 from './components/WorldMap5';
import Container from './containers/Container';

function App() {
	let width = 1000;
	let height = 562;
	let filters = [];

	const [selectedYear, setSelectedYear] = useState(1900);

	const handleChange = (value) => setSelectedYear(value);
	const handleChangeFilters = (values) => {
		filters = values;
	};

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
					<Row justify='space-around' style={{ marginBottom: '1rem' }}>
						<Col flex='500px'>
							<Select mode='multiple' className='w-100' onChange={handleChangeFilters}>
								<Select.Option value={0}>Kraje</Select.Option>
								<Select.Option value={1}>Miasta</Select.Option>
								<Select.Option value={2}>Krainy geografice i elementy przyrody</Select.Option>
								<Select.Option value={3}>Kontynenty i większe regiony</Select.Option>
							</Select>
						</Col>
					</Row>
					<WorldMap5 width={width} height={height} selectedYear={selectedYear} filters={filters} />
				</div>
			</Container>
		</div>
	);
}

export default App;
