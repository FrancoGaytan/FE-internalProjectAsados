import { PayCheckInfoResponse } from '../components/macro/PayCheckForm/PayCheckForm';
import { createEventRequest, EventByIdResponse, IEvent, IPublicEvent } from '../models/event';
import { IndividualCostResponse, ITransferReceiptInfoResponse } from '../models/transfer';
import { _delete, _get, _post, _put } from './httpService';

/**
 * Gets the public events for the Event Home page.
 */
export async function getPublicEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
	const url = '/events/getPublicEvents';
	return await _get<IPublicEvent[]>(url, signal);
}

export async function getPublicAndPrivateEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
	const url = '/events/getPublicAndPrivateEvents';
	return await _get<IPublicEvent[]>(url, signal);
}

/**
 * Gets the events by its ID.
 */
export async function getEventById(id: string | undefined, signal?: AbortSignal): Promise<EventByIdResponse> {
	const url = `/events/getEventById/${id}`;
	return await _get(url, signal);
}

/**
 * Gets the public events for the Event Home page.
 */
export async function createEvent(payload: createEventRequest, signal?: AbortSignal): Promise<EventByIdResponse> {
	const url = '/events/createEvent';
	return await _post<EventByIdResponse, createEventRequest>(url, payload, signal);
}

/**
 *
Edits an event by its ID, needs to be the organizer who calls it.
 */

export async function editEvent(id: string, payload: IEvent, signal?: AbortSignal): Promise<EventByIdResponse> {
	const url = `/events/editEvent/${id}`;
	return await _put<EventByIdResponse, IEvent>(url, payload, signal);
}

/**
 *
Edits just the chef or shopping designee by its ID
 */

export async function editRoles(id: string, payload: IEvent, signal?: AbortSignal): Promise<EventByIdResponse> {
	const url = `/events/editRoles/${id}`;
	return await _put<EventByIdResponse, IEvent>(url, payload, signal);
}

/**
 *
Subscribes a user by id for a certain event providing the event's id (12 byte Object ID)
 */
export async function subscribeToAnEvent(userId: string, eventId: string, signal?: AbortSignal): Promise<EventByIdResponse> {
	const url = `/events/subscribeToAnEvent/${userId}/${eventId}`;
	return await _put<EventByIdResponse>(url, signal);
}

/**
 *
Removes a user by id for a certain event providing the event's id (12 byte Object ID)
 */
export async function unsubscribeToAnEvent(userId: string, eventId: string, signal?: AbortSignal): Promise<EventByIdResponse> {
	const url = `/events/unsubscribeFromEvent/${userId}/${eventId}`;
	return await _put<EventByIdResponse>(url, signal);
}

/**
 * Deletes an event by its ID
 */
export async function deleteEvent(id: string, signal?: AbortSignal): Promise<EventByIdResponse> {
	const url = `/events/deleteEvent/${id}`;
	return await _delete(url, signal);
}

export async function getMembersAndReceiptsInfo(eventId: string, signal?: AbortSignal): Promise<ITransferReceiptInfoResponse[]> {
	const url = `/events/getMembersAndReceiptsInfo/${eventId}`;
	return await _get(url, signal);
}
/**
 * Gets the info of who a user is supposed to pay to for a certain event and the amount.
 */
export async function getMembersAmount(eventId: string, signal?: AbortSignal): Promise<PayCheckInfoResponse[]> {
	const url = `/events/getMembersAmount/${eventId}`;
	return await _get(url, signal);
}

export async function getMemberIndividualCost(eventId: string, userId: string, signal?: AbortSignal): Promise<IndividualCostResponse> {//cambiar por userAmount
	const url = `/events/getMemberIndividualCost/${userId}/${eventId}`;
	return await _get(url, signal);
}