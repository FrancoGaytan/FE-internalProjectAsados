export interface LoginRequest {
	email: string;
	password: string;
}
export interface LoginResponse {
	name: string;
	jwt: string;
	id: string;
}

export interface RegisterResponse {
	jwt: string;
}

export interface IUser {
	_id: string;
	name: string;
	lastName: string;
	email: string;
	password?: string;
	confirmPassword?: string;
	specialDiet: string[];
	cbu?: string;
	alias?: string;
	profilePicture?: string;
}

export interface IPublicUser {
	_id: string;
	name: string;
	lastName: string;
	email: string;
	specialDiet: string[];
	cbu?: string;
	alias?: string;
	profilePicture?: string;
}

export interface RegisterRequest {
	name: string;
	lastName: string;
	email: string;
	password: string;
	repeatedPassword?: string;
	specialDiet: string[]; // TODO: estos strings solo pueden ser celiac, hypertensive, vegan, vegetarian
}

export interface profilePicture {
	file?: any;
}

export interface EventUserResponse {
	userId: string;
	userName: string;
	userLastName: string;
	transferReceipt: string | null;
	hasReceiptApproved: boolean | null;
	hasUploaded: boolean;
	specialDiet: [];
}

export interface EditUserResponse {
	imageId: string;
}

export interface IsUserDebtorResponse {
	eventId: string;
	reason: string;
}
