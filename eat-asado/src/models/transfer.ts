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
	receiver?: string;
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

export interface ITransferReceiptResponse {
	_id: string;
	amount: number;
	description: string;
	datetime: string;
	event: string;
	hasPaid: boolean;
	image: string;
	paymentMethod: string;
	user: string;
}

export interface IUploadFileResponse {
	imageId: string;
}

export interface IndividualCostResponse {
	userAmount: number;
}