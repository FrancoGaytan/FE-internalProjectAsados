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
export async function getEventById(id: number, token: string, signal?: AbortSignal): Promise<any> {
	//FIXME: Type TBD
	try {
		const response = await fetch(`${baseURL}/events/getEventById/${id}`, {
			...fetchConfig,
			method: 'GET',
			signal,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});

		if (!response.ok) {
			throw new Error('getEventById failed');
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
export async function createEvent(body: Event, token: string, signal?: AbortSignal): Promise<any> {
	//FIXME: Type TBD and add payload.
	try {
		const response = await fetch(`${baseURL}/events/createEvent`, {
			...fetchConfig,
			method: 'POST',
			signal,
			body: body ? JSON.stringify(body) : undefined,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
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
 *
Edits an event by its id (12 byte Object ID)
 */

export async function editEvent<T = any>(id: number, payload: T, token: string, signal?: AbortSignal): Promise<any> {
	//TODO: Nose si es necesario el body en este caso //FIXME: Type TBD and add payload.
	try {
		const response = await fetch(`${baseURL}/events/editEvent/${id}`, {
			...fetchConfig,
			method: 'PUT',
			signal,
			body: payload ? JSON.stringify(payload) : undefined,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});

		if (!response.ok) {
			throw new Error('editEvent failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

/**
 * Deletes an event by its id (12 byte Object ID)
 */
export async function deleteEvent(id: number, token: string, signal?: AbortSignal): Promise<any> {
	//FIXME: Type TBD
	try {
		const response = await fetch(`${baseURL}/events/deleteEvent/${id}`, {
			...fetchConfig,
			method: 'DELETE',
			signal,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});

		if (!response.ok) {
			throw new Error('deleteEvent failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}
