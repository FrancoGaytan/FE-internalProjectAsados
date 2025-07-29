export const register = Object.seal({
	name: 'Nombre',
	lastName: 'Apellido',
	email: 'Email',
	password: 'Contraseña',
	confirmPassword: 'Confirmar contraseña',
	emailPlaceholder: 'usuario@endava.com',
	emailDescription: 'Por favor, utilizá tu mail de Endava',
	passwordDescription: 'Como mínimo 8 caracteres incluyendo: 1 minúscula, 1 mayúscula, 1 carácter especial y 1 número',
	specialDiet: 'Dieta especial',
	specialDietOptional: '(opcional)',
	specialDietOptions: {
		vegan: '¿Sos vegano?',
		vegetarian: '¿Sos vegetariano?',
		hypertensive: '¿Sos hipertenso?',
		celiac: '¿Sos celíaco?'
	},
	registerTitle: 'Registro',
	registerBtn: 'REGISTRO',
	successMsg: 'Se ha registrado con éxito',
	failureMsg: 'No se pudo completar el registro correctamente',
	wrongPassword: 'Formato de contraseña incorrecto',
	passwordArentMatching: 'Las contraseñas ingresadas no coinciden'
});
