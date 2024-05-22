import { IUser } from './user';

export interface transferReceipt {
	amount: number;
	description: string;
	eventId: string;
	hasPaid: boolean;
	image: string;
	paymentMethod: string;
	userId: string;
	isShoppingDesignee?: string | undefined;
	_id: string;
}

export interface purchaseReceipt {
	amount: number;
	description: string;
	image: string;
	_id: string;
}

export interface ITransferReceiptRequest {
	amount: number;
	description: string;
	user: string;
	paymentMethod: string;
	file: any;
}

export interface ITransferReceiptImage {
	file: any;
}
