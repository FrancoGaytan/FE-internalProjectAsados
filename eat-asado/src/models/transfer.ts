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
