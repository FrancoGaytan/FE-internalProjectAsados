import { IUser } from '../models/user';

const baseURL = process.env.REACT_APP_ENDPOINT;

const fetchConfig: RequestInit = {
	mode: 'cors',
	cache: 'no-cache',
	credentials: 'same-origin'
};

/**
 * Gets all users in the database.
 */
export async function getUsers(token: string, signal?: AbortSignal): Promise<IUser[]> {
	try {
		const response = await fetch(`${baseURL}/users/getUsers`, {
			...fetchConfig,
			method: 'GET',
			signal,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});

		if (!response.ok) {
			throw new Error('getUsers failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

/**
 * Gets a user by its id (12 byte object ID)
 */
export async function getUserById(id: number, token: string, signal?: AbortSignal): Promise<any> {
	//FIXME: Type TBD
	try {
		const response = await fetch(`${baseURL}/users/getUserById/${id}`, {
			...fetchConfig,
			method: 'GET',
			signal,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});

		if (!response.ok) {
			throw new Error('getUserById failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

/**
 * Creates a user
 */
export async function register<T = any>(body: T, signal?: AbortSignal): Promise<any> {
	//FIXME: Type TBD and add payload.
	try {
		const response = await fetch(`${baseURL}/events/register`, {
			...fetchConfig,
			method: 'POST',
			signal,
			body: body ? JSON.stringify(body) : undefined,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error('register failed');
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
Edits an user by its id (12 byte Object ID)
 */

export async function editUser<T = any>(id: number, payload: T, token: string, signal?: AbortSignal): Promise<any> {
	//FIXME: Type TBD and add payload.
	try {
		const response = await fetch(`${baseURL}/users/editUser/${id}`, {
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
			throw new Error('editUser failed');
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
export async function deleteUser(id: number, token: string, signal?: AbortSignal): Promise<any> {
	//FIXME: Type TBD
	try {
		const response = await fetch(`${baseURL}/users/deleteUser/${id}`, {
			...fetchConfig,
			method: 'DELETE',
			signal,
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});

		if (!response.ok) {
			throw new Error('deleteUser failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}
