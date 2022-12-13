import React from 'react';
import { useTranslation } from '../../stores/LocalizationContext';

const Login = () => {
	const translation = useTranslation('login');
	return (
		<div>{translation.username}</div>
	);
};

export default Login;
