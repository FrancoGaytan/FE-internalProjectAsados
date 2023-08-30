import { LoginRequest, LoginResponse } from '../models/user';
import { _post } from './httpService';

/**
 * posts the user credentials in order to validate identity
 */
export async function _login(payload: LoginRequest, signal?: AbortSignal): Promise<LoginResponse> {
	const url = '/login/';
	return await _post<LoginResponse, LoginRequest>(url, payload, signal);
}
