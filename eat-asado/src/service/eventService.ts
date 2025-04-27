import { IEvent, IPublicEvent } from '../models/event';
import { _delete, _get, _post, _put } from './httpService';

const baseUrl = '/events';

/**
 * Gets the public events for the Event Home page.
 */
export async function getPublicEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
	const url = `${baseUrl}/getPublicEvents`;
	return await _get<IPublicEvent[]>(url, signal);
}

export async function getPublicAndPrivateEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
	const url = `${baseUrl}/getPublicAndPrivateEvents`;
	return await _get<IPublicEvent[]>(url, signal);
}

/**
 * Gets the events by its ID.
 */
export async function getEventById(id: string | undefined, signal?: AbortSignal): Promise<any> {
	const url = `${baseUrl}/getEventById/${id}`;

	return await _get(url, signal);
}

/**
 * Gets the public events for the Event Home page.
 */
export async function createEvent(payload: IEvent, signal?: AbortSignal): Promise<any> {
	const url = `${baseUrl}/createEvent`;
	return await _post<any, IEvent>(url, payload, signal);
}

/**
 *
Edits an event by its ID, needs to be the organizer who calls it.
 */

export async function editEvent(id: string | undefined, payload: IEvent, signal?: AbortSignal): Promise<any> {
	const url = `${baseUrl}/editEvent/${id}`;
	return await _put<any, IEvent>(url, payload, signal);
}

/**
 *
Edits just the chef or shopping designee by its ID
 */

export async function editRoles(id: number, payload: IEvent, signal?: AbortSignal): Promise<any> {
	//TODO: tipar any
	const url = `${baseUrl}/editRoles/${id}`;
	return await _put<any, IEvent>(url, payload, signal);
}

/**
 *
Subscribes a user by id for a certain event providing the event's id (12 byte Object ID)
 */
export async function subscribeToAnEvent(userId: string, eventId: string, signal?: AbortSignal): Promise<any> {
	//TODO: tipar any
	const url = `${baseUrl}/subscribeToAnEvent/${userId}/${eventId}`;
	return await _put<any>(url, signal); //a esto le falta autorizacion payload?
}

/**
 *
Removes a user by id for a certain event providing the event's id (12 byte Object ID)
 */
export async function unsubscribeToAnEvent(userId: string, eventId: string, signal?: AbortSignal): Promise<any> {
	//TODO: tipar any
	const url = `${baseUrl}/unsubscribeFromEvent/${userId}/${eventId}`;
	return await _put<any>(url, signal); //a esto le falta autorizacion payload?
}

/**
 * Deletes an event by its ID
 */
export async function deleteEvent(id: number, signal?: AbortSignal): Promise<any> {
	//TODO: tipar any
	const url = `${baseUrl}/deleteEvent/${id}`;
	return await _delete(url, signal);
}

export async function getMembersAndReceiptsInfo(eventId: string, signal?: AbortSignal): Promise<any> {
	//TODO: tipar any
	const url = `${baseUrl}/getMembersAndReceiptsInfo/${eventId}`;
	return await _get(url, signal);
}
