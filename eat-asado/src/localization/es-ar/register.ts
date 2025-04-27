export const register = Object.seal({
	name: 'Nombre',
	lastName: 'Apellido',
	email: 'Email',
	password: 'Contraseña',
	confirmPassword: 'Confirmar contraseña',
	emailPlaceholder: 'usuario@endava.com',
	emailDescription: 'Por favor, utilizar tu mail de Endava',
	passwordDescription: 'Como mínimo 8 caracteres incluyendo: 1 minúscula, 1 mayúscula, 1 caracter especial y 1 número',
	specialDiet: 'Dieta especial',
	specialDietOptional: '(opcional)',
	specialDietOptions: {
		vegan: 'Sos Vegano?',
		vegetarian: 'Sos Vegetariano?',
		hypertensive: 'Sos Hipertenso?',
		celiac: 'Sos Celíaco?'
	},
	registerTitle: 'Registro',
	registerBtn: 'REGISTRO',
	successMsg: 'Se ha registrado con éxito',
	failureMsg: "You couldn't register successfully",
	wrongPassword: 'Formato de contraseña incorrecto',
	passwordArentMatching: 'Las contraseñas ingresadas no coinciden'
});
