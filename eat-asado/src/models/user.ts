export interface LoginResponse {
	name: string;
	jwt: string;
	id: string;
}

export interface IUser {
	id: string;
	name: string;
	email: string;
	password: string;
	verificationCode?: string;
	cbu?: string;
	alias?: string;
	profilePicture?: string;
	specialDiet?: string[]; //TODO: validar que esto sea un arreglo de string
}

export interface LoginRequest {
	email: string;
	password: string;
}
