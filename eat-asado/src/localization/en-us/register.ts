export const register = Object.seal({
	name: 'Name',
	lastName: 'Last Name',
	email: 'Email',
	password: 'Password',
	confirmPassword: 'Confirm Password',
	emailPlaceholder: 'user@endava.com',
	emailDescription: 'Please, use your Endava email address',
	passwordDescription: 'At least 8 characters including: 1 lowercase, 1 uppercase, 1 special character and 1 number',
	specialDiet: 'Special Diet',
	specialDietOptional: '(optional)',
	specialDietOptions: {
		vegan: 'Are you Vegan?',
		vegetarian: 'Are you Vegetarian?',
		hypertensive: 'Are you Hypertensive?',
		celiac: 'Are you Celiac?'
	},
	registerTitle: 'Register',
	registerBtn: 'REGISTER',
	successMsg: 'You have registered successfully',
	failureMsg: "You couldn't register successfully",
	wrongPassword: 'Invalid password format',
	passwordArentMatching: 'Passwords are not matching'
});
