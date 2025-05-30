export interface IPurchaseReceipt {
	amount: number;
	description: string;
	image: string;
	_id: string;
	participants: string[];
	event: string;
	shoppingDesignee: string;
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
