import { IUser } from './user';

export interface transferReceipt {
	amount: number;
	description: string;
	datetime: Date;
	eventId: string;
	hasPaid: boolean;
	image: string;
	paymentMethod: string;
	userId: string;
	isShoppingDesignee?: string;
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

export interface ITransferReceiptInfoResponse {
	userId: string;
	userLastName: string;
	userName: string;
	hasReceiptApproved: boolean | null;
	hasUploaded: boolean;
	specialDiet: [];
	transferReceipt: string | null;
}
