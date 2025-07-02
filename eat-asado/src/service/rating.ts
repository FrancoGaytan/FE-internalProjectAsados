import { IRatingResponse, IRatingRequest } from '../models/ratings';
import { _delete, _get, _post, _put, _postFiles, __getFiles } from './httpService';

export async function createRating(idEvent: string, idUser: string, payload: IRatingRequest, signal?: AbortSignal): Promise<IRatingResponse> {
	const url = `/ratings/createRating/${idEvent}/${idUser}`;
	return await _post<IRatingResponse, IRatingRequest>(url, payload, signal);
}

export async function getRatingFromUser(idEvent: string, idUser: string, signal?: AbortSignal): Promise<IRatingResponse> {
	const url = `/ratings/getRatingFromUser/${idEvent}/${idUser}`;
	return await _get(url, signal);
}
