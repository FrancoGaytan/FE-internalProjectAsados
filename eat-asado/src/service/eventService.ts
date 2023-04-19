const baseURL = process.env.REACT_APP_ENDPOINT;

const fetchConfig: RequestInit = {
	mode: 'cors',
	cache: 'no-cache',
	credentials: 'same-origin',
	headers: {
		'Content-Type': 'application/json'
	}
};

/**
 * Gets the public events for the Event Home page.
 */
export async function getPublicEvents(signal?: AbortSignal): Promise<any> {
	try {
		const response = await fetch(`${baseURL}/events/getPublicEvents`, { ...fetchConfig, method: 'GET', signal });

		if (!response.ok) {
			throw new Error('getPublicEvents failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}


/**
 * Gets the events by its ID (12 byte object ID).
 */
export async function getEventsById(id: number, signal?: AbortSignal): Promise<any> {
	try {
		const response = await fetch(`${baseURL}/events/getEventsById/${id}`, { ...fetchConfig, method: 'GET', signal });//hace falta validar que sea de 12 bytes?

		if (!response.ok) {
			throw new Error('getEventsById failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

/**
 * Gets the public events for the Event Home page.
 */
export async function createEvent(event: Event, signal?: AbortSignal): Promise<any> {
	try {
		const response = await fetch(`${baseURL}/events/createEvent`, { ...fetchConfig, method: 'POST', signal });

		if (!response.ok) {
			throw new Error('getPublicEvents failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}