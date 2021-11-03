import React from 'react';
import styled from 'styled-components';

const CenteredDiv = styled.div`
	margin: auto;
	max-width: 1200px;
	text-align: center;
`;

const Container: React.FC<{}> = ({ children }) => {
	return <CenteredDiv>{children}</CenteredDiv>;
};

export default Container;
