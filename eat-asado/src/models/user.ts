export interface LoginResponse {
	name: string;
	jwt: string;
	id: string;
}

export interface IUser {
	//TODO: definir si el id va a ser un number o string asi lo normalizamos
	id: number; //TODO: Esto lo necesitaba para vincularlo con la creacion del evento, necesita el id del organizador por lo que tiene que estar aca
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

//TODO: chequear si nani termino los endpoints de update y delete de usuario y completar las interfaces si es necesario
