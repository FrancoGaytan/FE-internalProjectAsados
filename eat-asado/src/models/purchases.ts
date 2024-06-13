export interface purchaseReceipt {
	amount: number;
	description: string;
	image: string;
	_id: string;
}

export interface IPurchaseReceiptImage {
	file: any;
}

export interface IPurchaseReceiptRequest {
	//nuevo
	amount: number;
	description: string;
	file: any;
}
