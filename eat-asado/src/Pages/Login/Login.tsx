import React from 'react';
import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import PublicLayout from '../../Components/macro/PublicLayout';

const Login = () => {
	const translation = useTranslation('login');

	return (
		<PublicLayout>
			<p className={styles.title}>LOGIN</p>
			<label htmlFor="email" className={styles.loginLabel}>Email Endava</label>
			<input id="email" placeholder="EMAIL" type="text" />
			<label htmlFor="password" className={styles.loginLabel}>Clave</label>
			<input id="password" placeholder="CONTRASEÑA" type="password" />
			<Button kind="primary" size="large">
				LOGIN
			</Button>
			<a href="/#" className={styles.forgotPassword}>
				FORGOT PASSWORD
			</a>
		</PublicLayout>
	);
};

export default Login;
