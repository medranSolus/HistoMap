import React from 'react';
import './App.scss';
import WorldMap from './components/WorldMap';
import Container from './containers/Container';

function App() {
	return (
		<div className='App'>
			<header className='App-header'>HistoMap</header>
			<Container>
				<WorldMap />
			</Container>
		</div>
	);
}

export default App;
