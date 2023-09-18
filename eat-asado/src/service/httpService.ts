import { localStorageKeys } from '../utils/localStorageKeys';

const baseURL = process.env.REACT_APP_ENDPOINT;
const token = JSON.parse(window.localStorage.getItem(localStorageKeys.token) as string);

const fetchConfig: RequestInit = {
	mode: 'cors',
	cache: 'no-cache',
	credentials: 'same-origin',
	headers: {
		'Content-Type': 'application/json',
		Authorization: token
	}
};

export async function _get<T>(path: string, signal?: AbortSignal): Promise<T> {
	try {
		const response = await fetch(`${baseURL}${path}`, {
			...fetchConfig,
			method: 'GET',
			signal
		});

		if (!response.ok) {
			throw new Error('login failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

export async function _post<T, P = any>(path: string, payload?: P, signal?: AbortSignal): Promise<T> {
	try {
		const response = await fetch(`${baseURL}${path}`, {
			...fetchConfig,
			method: 'POST',
			signal,
			body: payload ? JSON.stringify(payload) : undefined
		});

		if (!response.ok) {
			throw new Error('login failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

export async function _put<T, P = any>(path: string, payload: P, signal?: AbortSignal): Promise<T> {
	try {
		const response = await fetch(`${baseURL}${path}`, {
			...fetchConfig,
			method: 'PUT',
			signal,
			body: payload ? JSON.stringify(payload) : undefined
		});

		if (!response.ok) {
			throw new Error('login failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

export async function _delete<T = any>(path: string, signal?: AbortSignal): Promise<T> {
	try {
		const response = await fetch(`${baseURL}${path}`, {
			...fetchConfig,
			method: 'DELETE',
			signal
		});

		if (!response.ok) {
			throw new Error('login failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}
