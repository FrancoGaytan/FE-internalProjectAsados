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
	//TODO: definir si el id va a ser un number o string asi lo normalizamos
	_id: string; //esto estaba como number //TODO: Esto lo necesitaba para vincularlo con la creacion del evento, necesita el id del organizador por lo que tiene que estar aca
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

export interface RegisterRequest {
	name: string;
	lastName: string;
	email: string;
	password: string;
	repeatedPassword?: string;
	specialDiet: string[]; // TODO: estos strings solo pueden ser celiac, hypertensive, vegan, vegetarian
}

//TODO: chequear si nani termino los endpoints de update y delete de usuario y completar las interfaces si es necesario
