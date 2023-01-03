import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import FormLayout from '../../Components/macro/layout/FormLayout';

const Register = () => {
	const translation = useTranslation('login');

	return (
		<FormLayout>
			<p className={styles.title}>REGISTER</p>
			<label htmlFor="email" className={styles.registerLabel}>
				Email Endava
			</label>
			<input id="email" placeholder="EMAIL" type="text" />
			<label htmlFor="password" className={styles.registerLabel}>
				Clave
			</label>
			<input id="password" placeholder="CONTRASEÑA" type="password" />
			<Button kind="primary" size="large">
				REGISTER
			</Button>
		</FormLayout>
	);
};

export default Register;