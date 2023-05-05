import { IUser, LoginRequest } from '../models/user';
import { _post } from './httpService';

/**
 * posts the user credentials in order to validate identity
 */
export async function _login(payload: LoginRequest, signal?: AbortSignal): Promise<IUser> {
	const url = '/login/';
	return await _post<IUser, LoginRequest>(url, payload, signal);
}
