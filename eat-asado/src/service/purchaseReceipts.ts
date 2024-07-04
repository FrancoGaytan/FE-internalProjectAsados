import { IPurchaseReceiptImage, IPurchaseReceiptRequest } from '../models/purchases';
import { _delete, _get, _post, _put, _postFiles, __getFiles } from './httpService';

export async function createPurchaseReceipt(idEvent: string, payload: IPurchaseReceiptRequest, signal?: AbortSignal): Promise<any> {
	const url = `/purchaseReceipts/createPurchaseReceipt/${idEvent}`;
	return await _post<any, IPurchaseReceiptRequest>(url, payload, signal);
}

export async function uploadPurchaseFile(formFile: IPurchaseReceiptRequest, idPurchaseReceipt: string, signal?: AbortSignal): Promise<any> {
	const url = `/purchaseReceipts/uploadFile/${idPurchaseReceipt}`;
	return await _postFiles(formFile, url, signal);
}

export async function getPurchaseReceipts(event: string | undefined, signal?: AbortSignal): Promise<any> {
	const url = `/purchaseReceipts/getPurchaseReceiptsByEvent/${event}`;
	return await _get(url, signal);
}

export async function deleteEventPurchase(idPurchaseReceipt: string, event: string | undefined, signal?: AbortSignal): Promise<any> {
	const url = `/purchaseReceipts/deletePurchaseReceipt/${idPurchaseReceipt}/${event}`;
	return await _delete(url, signal);
}

export async function getImage(idImage: string | undefined, signal?: AbortSignal): Promise<any> {
	//esta funcion no es propia de purchase, moverla a un service Image
	const url = `/images/getImage/${idImage}`;
	return await __getFiles(url, signal);
}
