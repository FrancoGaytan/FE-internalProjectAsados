import { ITransferReceiptImage } from '../models/transfer';
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
			throw new Error('GET request failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

export async function __getFiles(path: string, signal?: AbortSignal): Promise<any> {
	try {
		const response = await fetch(`${baseURL}${path}`, {
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				Authorization: token
			},
			method: 'GET',
			signal
		});

		if (!response.ok) {
			throw new Error('GET Files request failed');
		}

		return await response.blob();
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
			throw new Error('POST request failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

export async function _postFiles(formFile: any, path: string, signal?: AbortSignal): Promise<ITransferReceiptImage> {
	try {
		const formData = new FormData();
		formData.append('file', formFile);

		const response = await fetch(`${baseURL}${path}`, {
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				Authorization: token
			},
			method: 'POST',
			signal,
			body: formData
		});

		if (!response.ok) {
			throw new Error('POST Files request failed');
		}

		return response as any;
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
			throw new Error('PUT request failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}

export async function _putFiles<T>(formFile: any, path: string, signal?: AbortSignal): Promise<T> {
	try {
		const formData = new FormData();
		formData.append('file', formFile);
		const response = await fetch(`${baseURL}${path}`, {
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				Authorization: token
			},
			method: 'PUT',
			signal,
			body: formData
		});

		if (!response.ok) {
			throw new Error('PUT request failed');
		}

		return response as any;
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
			throw new Error('DELETE request failed');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw new Error(`${error}`);
	}
}
