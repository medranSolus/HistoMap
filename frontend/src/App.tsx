import React from 'react';
import './App.scss';
import WorldMap3 from './components/WorldMap3';
import Container from './containers/Container';

function App() {
	let width = 1520;
	let height = 600;

	return (
		<div className='App'>
			<header className='App-header'>HistoMap</header>
			<Container>
				<WorldMap3 width={width} height={height} />
			</Container>
		</div>
	);
}

export default App;
