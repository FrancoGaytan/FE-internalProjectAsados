const baseURL = process.env.REACT_APP_ENDPOINT;

const fetchConfig: RequestInit = {
	mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
	headers: {
		'Content-Type': 'application/json'
	}
};

export async function getPublicEvents(): Promise<any> {
	try {
		const response = await fetch(`${baseURL}/events/getPublicEvents`, {...fetchConfig, method: 'GET'});

		if (!response.ok) {
			throw new Error('Something unexpected happened');
		}

		const data = await response.json();

		return data;
	} catch (e) {
		console.error(e);
	}
}
