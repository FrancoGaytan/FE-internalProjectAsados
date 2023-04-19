import { LoginRequest } from "../models/users";

const baseURL = process.env.REACT_APP_ENDPOINT;

const fetchConfig: RequestInit = {
	mode: 'cors',
	cache: 'no-cache',
	credentials: 'same-origin',
	headers: {
		'Content-Type': 'application/json'
	}
};

/**
 * post the user credentials in order to validate identity
 */
export async function login(payload: any, signal?: AbortSignal, ): Promise<any> {//TODO: el payload tiene que ser de tipo LoginRequest
	try {
		const response = await fetch(`${baseURL}/login/`, { ...fetchConfig, method: 'POST', signal, body: payload ? JSON.stringify(payload) : undefined });

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