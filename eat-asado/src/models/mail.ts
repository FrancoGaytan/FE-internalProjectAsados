export interface IMailRequest {
	email: string;
}

export interface IVerificationCode {
	email: string;
	verificationCode: string;
}

export interface IRecoverPasswordRequest {
	email: string;
	verificationCode: string;
	password: string;
}
