import React from 'react';
import { useTranslation } from '../../stores/LocalizationContext';
import './styles.scss';

const Login = () => {
	const translation = useTranslation('login');
	return (
		<div>{translation.username}</div>
	);
};

export default Login;
