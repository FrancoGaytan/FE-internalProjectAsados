export interface LoginRequest {
	email: string;
	password: string;
}
export interface LoginResponse {
	name: string;
	jwt: string;
	id: string;
}

export interface RegisterRequest {
	name: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	specialDiet: string[];
	cbu?: string;
	alias?: string;
	profilePicture?: string;
}

export interface IUser extends RegisterRequest {
	id: string;
	verificationCode?: string;
}

//TODO: chequear si nani termino los endpoints de update y delete de usuario y completar las interfaces si es necesario
