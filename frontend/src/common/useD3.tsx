import React from 'react';
import * as d3 from 'd3';

const useD3 = (renderChartFn: (container: d3.Selection<any, any, any, any>) => any, dependencies: any[]) => {
	const ref = React.useRef<any>();

	React.useEffect(() => {
		renderChartFn(d3.select(ref.current));
		return () => {};
		// eslint-disable-next-line
	}, dependencies);
	return ref;
};

export default useD3;
