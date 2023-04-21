import { IEvent, IPublicEvent } from '../models/event';
import { _delete, _get, _post, _put } from './httpService';

/**
 * Gets the public events for the Event Home page.
 */
export async function getPublicEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
	const url = '/events/getPublicEvents';
	return await _get<IPublicEvent[]>(url, signal);
}

/**
 * Gets the events by its ID.
 */
export async function getEventById(id: unknown, signal?: AbortSignal): Promise<any> {
	const url = `/events/getEventById/${id}`;

	return await _get(url, signal);
}

/**
 * Gets the public events for the Event Home page.
 */
export async function createEvent(payload: IEvent, signal?: AbortSignal): Promise<any> {
	const url = '/events/createEvent';
	return await _post<any, IEvent>(url, payload, signal);
}

/**
 *
Edits an event by its ID
 */

export async function editEvent(id: number, payload: IEvent, signal?: AbortSignal): Promise<any> {
	const url = `/events/editEvent/${id}`;
	return await _put<any, IEvent>(url, payload, signal);
}

/**
 * Deletes an event by its ID
 */
export async function deleteEvent(id: number, signal?: AbortSignal): Promise<any> {
	const url = `/events/deleteEvent/${id}`;
	return await _delete(url, signal);
}
