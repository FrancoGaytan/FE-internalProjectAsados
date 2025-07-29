import { IMailRequest, IRecoverPasswordRequest, IVerificationCode } from '../models/mail';
import { _post, _put } from './httpService';

export async function forgotPassword(payload: IMailRequest, signal?: AbortSignal): Promise<any> {
	const url = `/password/forgot`;
	return await _post<any, IMailRequest>(url, payload, signal);
}

export async function verifyCode(payload: IVerificationCode, signal?: AbortSignal): Promise<any> {
	//TODO: tipar any
	const url = `/password/verifyCode`;
	return await _put<any, IVerificationCode>(url, payload, signal);
}

export async function recoverPassword(payload: IRecoverPasswordRequest, signal?: AbortSignal): Promise<any> {
	//TODO: tipar any
	const url = `/password/recover`;
	return await _put<any>(url, payload, signal);
}
