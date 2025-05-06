import { IUser, RegisterRequest, RegisterResponse } from '../models/user';
import { _delete, _get, _post, _put, _putFiles } from './httpService';

const baseUrl = '/users';

/**
 * Creates a user
 */
export async function registering(payload: RegisterRequest, signal?: AbortSignal): Promise<RegisterResponse> {
	const url = `${baseUrl}/register`;
	return await _post<RegisterResponse, RegisterRequest>(url, payload, signal);
}

/**
 * Gets all users in the database.
 */
export async function getUsers(signal?: AbortSignal): Promise<IUser[]> {
	const url = `${baseUrl}/getUsers`;
	return await _get(url, signal);
}

/**
 * Gets a user by its ID
 */
export async function getUserById(id: unknown, signal?: AbortSignal): Promise<any> {
	const url = `${baseUrl}/getUser/${id}`;
	return await _get(url, signal);
}

/**
 *
Edits an user by its ID
 */

export async function editUser(id: unknown, payload: any, signal?: AbortSignal): Promise<any> {
	const url = `${baseUrl}/editUser/${id}`;
	return await _put(url, payload, signal);
}

export async function editProfilePicture(id: unknown, formFile: any, signal?: AbortSignal): Promise<any> {
	const url = `${baseUrl}/editProfilePicture/${id}`;
	return await _putFiles(formFile, url, signal);
}

/**
 * Deletes an event by its id (12 byte Object ID)
 */
export async function deleteUser(id: unknown, signal?: AbortSignal): Promise<any> {
	const url = `${baseUrl}/deleteUser/${id}`;
	return await _delete(url, signal);
}

export async function hasUploadedTransferReceipt(idUser: string, idEvent: string, signal?: AbortSignal): Promise<any> {
	const url = `/users/hasUploadedTransferReceipt/${idUser}/${idEvent}`;
	return await _get(url, signal);
}

export async function isUserDebtor(idUser: string, signal?: AbortSignal): Promise<any> {
	const url = `/users/isUserDebtor/${idUser}`;
	return await _get(url, signal);
}
