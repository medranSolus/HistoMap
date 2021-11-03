import React from 'react';
import './App.scss';
import WorldMap from './components/WorldMap';
import WorldMap2 from './components/WorldMap2';
import Container from './containers/Container';

function App() {
	return (
		<div className='App'>
			<header className='App-header'>HistoMap</header>
			<Container>
				{/* <WorldMap /> */}
				<WorldMap2 />
			</Container>
		</div>
	);
}

export default App;
