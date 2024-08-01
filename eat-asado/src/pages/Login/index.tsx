import { useTranslation } from '../../stores/LocalizationContext';
import Button from '../../components/micro/Button/Button';
import FormLayout from '../../components/macro/layout/FormLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginRequest } from '../../models/user';
import { useAuth } from '../../stores/AuthContext';
import styles from './styles.module.scss';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';

export function Login(): JSX.Element {
	const navigate = useNavigate();
	const lang = useTranslation('login');
	const { login, isLoading } = useAuth();
	const [loginCredentials, setLoginCredentials] = useState<LoginRequest>({
		email: '',
		password: ''
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setLoginCredentials({
			...loginCredentials,
			[e.target.id]: e.target.value
		});
	}

	async function handleLogin(e: React.MouseEvent): Promise<void> {
		e.preventDefault();
		await login(loginCredentials.email, loginCredentials.password);
	}

	return (
		<FormLayout>
			<div className={styles.closeBtn} onClick={() => navigate('/')}></div>

			<h3 className={styles.title}>{lang.loginTitle}</h3>

			<label htmlFor="email" className={styles.loginLabel}>
				{lang.email}
			</label>

			<input
				id="email"
				className={styles.loginInput}
				placeholder={lang.user}
				type="text"
				onChange={e => handleChange(e)}
				value={loginCredentials.email}
			/>

			<label htmlFor="password" className={styles.loginLabel}>
				{lang.password}
			</label>

			<input
				id="password"
				className={styles.loginInput}
				placeholder={lang.password}
				type="password"
				onChange={e => handleChange(e)}
				value={loginCredentials.password}
			/>

			{isLoading ? (
				<span style={{ color: '#fff' }}>Cargando... (⌐■_■)</span> //TODO: Acá va un spinner para cuando esté cargando el login.
			) : (
				<Button kind="primary" size="large" type="submit" onClick={e => handleLogin(e)}>
					{lang.loginBtn}
				</Button>
			)}

			<a href="/recoverkey" className={styles.forgotPassword} id="recoverKey">
				{lang.forgotPassword}
			</a>

			<a href="/register" className={styles.register} id="register">
				<span>{lang.alreadyRegistered} </span>

				<span className={styles.registerHighlighted}>{lang.registerHere}</span>
			</a>
		</FormLayout>
	);
}
function setAlert(arg0: string, ERROR: any) {
	throw new Error('Function not implemented.');
}
