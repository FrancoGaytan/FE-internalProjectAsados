import { ITransferReceiptRequest, ITransferReceiptImage } from '../models/transfer';
import { _delete, _get, _post, _put, _postFiles } from './httpService';

export async function createTransferReceipt(idEvent: string, payload: ITransferReceiptRequest, signal?: AbortSignal): Promise<any> {
	const url = `/transferReceipts/createTransferReceipt/${idEvent}`;
	return await _post<any, ITransferReceiptRequest>(url, payload, signal);
}

export async function uploadFile(formFile: ITransferReceiptImage, idPurchaseReceipt: string, signal?: AbortSignal): Promise<any> {
	const url = `/transferReceipts/uploadFile/${idPurchaseReceipt}`;
	return await _postFiles(formFile, url, signal);
}
