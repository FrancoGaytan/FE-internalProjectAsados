import { IPurchaseReceiptImage, IPurchaseReceiptRequest } from '../models/purchases';
import { _delete, _get, _post, _put, _postFiles } from './httpService';

export async function createPurchaseReceipt(idEvent: string, payload: IPurchaseReceiptRequest, signal?: AbortSignal): Promise<any> {
	const url = `/purchaseReceipts/createPurchaseReceipt/${idEvent}`;
	return await _post<any, IPurchaseReceiptRequest>(url, payload, signal);
}

export async function uploadPurchaseFile(
	formFile: IPurchaseReceiptRequest,
	idPurchaseReceipt: string,
	idEvent: string,
	signal?: AbortSignal
): Promise<any> {
	const url = `/purchaseReceipts/uploadFile/${idPurchaseReceipt}/${idEvent}`;
	return await _postFiles(formFile, url, signal);
}
