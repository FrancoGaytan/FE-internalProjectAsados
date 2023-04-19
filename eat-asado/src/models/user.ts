export interface IUser {
	name: string;
	jwt: string;
	id: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}
