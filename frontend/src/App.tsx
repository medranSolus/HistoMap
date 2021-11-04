import React from 'react';
import './App.scss';
import WorldMap3 from './components/WorldMap3';
import WorldMap4 from './components/WorldMap4';
import Container from './containers/Container';

function App() {
	return (
		<div className='App'>
			<header className='App-header'>HistoMap</header>
			<Container>
				<WorldMap3 />
				{/* <WorldMap4 /> */}
			</Container>
		</div>
	);
}

export default App;
