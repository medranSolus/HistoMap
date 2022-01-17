import { message } from 'antd';
export const fetchApi = async (body) => {
	try {
		const response = await fetch('https://localhost:5001/api/markers', {
			method: 'post',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return await response.json();
	} catch (error) {
		console.log('[ERROR]: ', error);
		// message.error('Nie można połączyć się z serwerem');
		return {
			features: []
		};
	}
};
