import { IPublicEvent } from '../models/event';

const baseURL = process.env.REACT_APP_ENDPOINT;

const fetchConfig: RequestInit = {
	mode: 'cors',
	cache: 'no-cache',
	credentials: 'same-origin'
};

/**
 * Gets the public events for the Event Home page.
 */
export async function getPublicEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
	try {
		const response = await fetch(`${baseURL}/events/getPublicEvents`, {
			...fetchConfig,
			method: 'GET',
			signal,
			headers: {
				'Content-Type': 'application/json'
			}
		});

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
export async function getEventsById(id: number, token: string, signal?: AbortSignal): Promise<any> { //FIXME: Type TBD
	try {
		const response = await fetch(`${baseURL}/events/getEventsById/${id}`, {
			...fetchConfig,
			method: 'GET',
			signal,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			}
		});

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
export async function createEvent(body: Event, token: string, signal?: AbortSignal): Promise<any> { //FIXME: Type TBD and add payload.
	try {
		const response = await fetch(`${baseURL}/events/createEvent`, {
			...fetchConfig,
			method: 'POST',
			signal,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			}
		});

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
