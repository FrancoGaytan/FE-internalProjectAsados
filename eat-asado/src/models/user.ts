export interface LoginRequest {
	email: string;
	password: string;
}

// TODO: Check, login doesn't return this interface. This should be changed.
export interface IUser {
	id?: string;
	jwt?: string;
	name: string;
	verificationCode?: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	specialDiet: string[];
	cbu?: string;
	alias?: string;
	profilePicture?: string;
}

//TODO: chequear si nani termino los endpoints de update y delete de usuario y completar las interfaces si es necesario
