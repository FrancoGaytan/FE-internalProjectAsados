import React from 'react';
import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';

const Login = () => {
	const translation = useTranslation('login');

	return (
		<div className={styles.loginBody}>
			<section className={styles.container}>
				<p className={styles.title}>LOGIN</p>
				<input placeholder="EMAIL" type="text" />
				<input placeholder="CONTRASEÑA" type="password" />
				<Button kind="primary" size="large">
					LOGIN
				</Button>
			</section>
		</div>
	);
};

export default Login;
