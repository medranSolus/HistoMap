export const fetchApi = async (body) => {
	const response = await fetch('https://localhost:5001/api/markers', {
		method: 'post',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	return await response.json();
};
