import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import FormLayout from '../../Components/macro/layout/FormLayout';

const Login = () => {
	const translation = useTranslation('login');

	return (
		<FormLayout>
			<div className={styles.closeBtn}></div>
			<h3 className={styles.title}>LOGIN</h3>
			<label htmlFor="email" className={styles.loginLabel}>
				Email
			</label>
			<input id="email" className={styles.loginInput} placeholder="usuario@endava.com" type="text" />
			<label htmlFor="password" className={styles.loginLabel}>
				Clave
			</label>
			<input id="password" className={styles.loginInput} placeholder="Clave" type="password" />
			<Button kind="primary" size="large">
				LOGIN
			</Button>
			<a href="/register" className={styles.forgotPassword}>
				¿No te acordas de tu clave?
			</a>
		</FormLayout>
	);
};

export default Login;
