import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../components/micro/Button/Button';
import FormLayout from '../../components/macro/layout/FormLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { useAlert } from '../../stores/AlertContext';
import { usersDataMock } from '../../mocks/usersMockedData';
import { login } from '../../service';
import { LoginRequest } from '../../models/users';
import useLocalStorage from '../../hooks/useLocalStorage';
import { localStorageKeys } from '../../utils/localStorageKeys';
import { useAuth } from '../../stores/AuthContext';

export function Login(): JSX.Element {
	const lang = useTranslation('login');
	const { setAlert } = useAlert();
	const { setUser } = useAuth();
	const [_, setJWT] = useLocalStorage<string | null>(localStorageKeys.token, null);

	const navigate = useNavigate();

	const [loginCredentials, setLoginCredentials] = useState<LoginRequest>({
		email: 'prueba@endava.com',
		password: 'contraseña'
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginCredentials({
			...loginCredentials,
			[e.target.id]: e.target.value
		});
	};

	const handleLogin = (e: any) => {
		e.preventDefault();
		login({ email: loginCredentials.email, password: loginCredentials.password }).then(res => {
			setJWT(res.jwt);
			navigate('/');
			setUser(res);
		});
	};

	/* const validateCredentials = ({ email, password }: any) => {
		//Temporary call for design purposes, the lines above will change when we have an API that validates an user.
		const result = usersDataMock.find(user => user.email === email && user.password === password);
		if (result != null) {
			localStorage.setItem('user', result.user);
			navigate('/userProfile');
			setAlert(`${lang.welcomeMessage} ${result.user}!`, AlertTypes.SUCCESS);
		} else {
			setAlert(`${lang.loginErrorMessage}`, AlertTypes.ERROR);
		}
	}; */

	return (
		<FormLayout>
			<div className={styles.closeBtn}></div>
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
			<Button kind="primary" size="large" type="submit" onClick={e => handleLogin(e)}>
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
}
