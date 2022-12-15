import React from 'react';
import { useTranslation } from '../../stores/LocalizationContext';
import './styles.scss';

const Login = () => {
	const translation = useTranslation('login');
	return (
		<>
			<div className="inProgress">In Progress...</div>
		</>
	);
};

export default Login;
