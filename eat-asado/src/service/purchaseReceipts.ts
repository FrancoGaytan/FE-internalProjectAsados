import { IPurchaseAssignment } from '../components/macro/AssignationTable/AssignationTable';
import { IPurchaseReceiptRequest, IPurchaseByEvent, IPurchaseReceipt, IPurchaseAssignmentResponse } from '../models/purchases';
import { IUploadFileResponse } from '../models/transfer';
import { _delete, _get, _post, _put, _postFiles, __getFiles } from './httpService';

export async function createPurchaseReceipt(idEvent: string, payload: IPurchaseReceiptRequest, signal?: AbortSignal): Promise<IPurchaseReceipt> {
	const url = `/purchaseReceipts/createPurchaseReceipt/${idEvent}`;
	return await _post<IPurchaseReceipt, IPurchaseReceiptRequest>(url, payload, signal);
}

export async function uploadPurchaseFile(
	formFile: IPurchaseReceiptRequest,
	idPurchaseReceipt: string,
	signal?: AbortSignal
): Promise<IUploadFileResponse> {
	const url = `/purchaseReceipts/uploadFile/${idPurchaseReceipt}`;
	return await _postFiles(formFile, url, signal);
}

export async function getPurchaseReceipts(event: string | undefined, signal?: AbortSignal): Promise<IPurchaseReceipt[]> {
	const url = `/purchaseReceipts/getPurchaseReceiptsByEvent/${event}`;
	return await _get(url, signal);
}

export async function deleteEventPurchase(idPurchaseReceipt: string, event: string | undefined, signal?: AbortSignal): Promise<IPurchaseReceipt> {
	const url = `/purchaseReceipts/deletePurchaseReceipt/${idPurchaseReceipt}/${event}`;
	return await _delete(url, signal);
}

export async function getImage(idImage: string | undefined, signal?: AbortSignal): Promise<any> {
	//esta funcion no es propia de purchase, moverla a un service Image
	const url = `/images/getImage/${idImage}`;
	return await __getFiles(url, signal);
}

export async function assignMembersToReceipt(payload: { receipts: IPurchaseByEvent[] }, signal: AbortSignal): Promise<IPurchaseAssignmentResponse> {
	const url = `/purchaseReceipts/assignMembersToReceipt`;
	return await _put(url, payload, signal);
}

export async function getPurchaseReceiptsByEvent(idEvent: string, signal?: AbortSignal): Promise<IPurchaseAssignment[]> {
	const url = `/purchaseReceipts/getPurchaseReceiptsByEvent/${idEvent}`;
	return await _get<IPurchaseAssignment[]>(url, signal);
}
