import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import FormLayout from '../../Components/macro/layout/FormLayout';
import { useState } from 'react';

const Login = () => {
	const lang = useTranslation('login');
	const initialUserState = {
		userEmail: '',
		userPassword: ''
	};

	const [event, setEvent] = useState(initialUserState);

	return (
		<FormLayout>
			<div className={styles.closeBtn}></div>
			<h3 className={styles.title}>{lang.loginTitle}</h3>
			<label htmlFor="email" className={styles.loginLabel}>
				{lang.email}
			</label>
			<input id="email" className={styles.loginInput} placeholder={lang.user} type="text" />
			<label htmlFor="password" className={styles.loginLabel}>
				{lang.password}
			</label>
			<input id="password" className={styles.loginInput} placeholder={lang.password} type="password" />
			<Button kind="primary" size="large">
				{lang.loginBtn}
			</Button>
			<a href="/recoverkey" className={styles.forgotPassword} id="recoverKey">
				{lang.forgotPassword}
			</a>
			<a href="/register" className={styles.register} id="register">
				<span>{lang.alreadyRegistered} </span>
				<span className={styles.registerHighlighted}>{lang.registerHere}</span>
			</a>
		</FormLayout>
	);
};

export default Login;
