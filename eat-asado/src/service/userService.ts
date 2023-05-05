import { IUser } from '../models/user';
import { _delete, _get, _post, _put } from './httpService';

/**
 * Creates a user
 */
export async function register(payload: IUser, signal?: AbortSignal): Promise<IUser> {
	const url = '/users/register';
	return await _post<IUser>(url, payload, signal);
}

/**
 * Gets all users in the database.
 */
export async function getUsers(signal?: AbortSignal): Promise<IUser[]> {
	const url = '/users/getUsers';
	return await _get(url, signal);
}

/**
 * Gets a user by its ID
 */
export async function getUserById(id: unknown, signal?: AbortSignal): Promise<any> {
	const url = `/users/getUserById/${id}`; //TODO: agregarle el ?id= a todos los que buscan x id
	return await _get(url, signal);
}

/**
 *
Edits an user by its ID
 */

export async function editUser(id: unknown, payload: any, signal?: AbortSignal): Promise<any> {
	const url = `/users/editUser/${id}`;
	return await _put(url, payload, signal);
}

/**
 * Deletes an event by its id (12 byte Object ID)
 */
export async function deleteUser(id: unknown, signal?: AbortSignal): Promise<any> {
	const url = `/users/deleteUser/${id}`;
	return await _delete(url, signal);
}
