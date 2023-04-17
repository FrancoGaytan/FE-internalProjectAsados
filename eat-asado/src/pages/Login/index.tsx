import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../components/micro/Button/Button';
import FormLayout from '../../components/macro/layout/FormLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { useAlert } from '../../stores/AlertContext';

export function Login(): JSX.Element {
	const lang = useTranslation('login');
	const { setAlert } = useAlert();

	const initialState = {
		email: '',
		password: ''
	};

	const navigate = useNavigate();

	const Users = [
		{
			email: 'martin.lazarte@endava.com',
			password: '1234',
			user: 'mlazarte'
		},
		{
			email: 'franco.gaytan@endava.com',
			password: '1234',
			user: 'fgaytan'
		}
	];

	const [loginCredentials, setLoginCredentials] = useState(initialState);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginCredentials({
			...loginCredentials,
			[e.target.id]: e.target.value
		});
	};

	const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		validateCredentials(loginCredentials);
	};

	const validateCredentials = ({ email, password }: any) => {
		//Temporary call for design purposes, the lines above will change when we have an API that validates an user.
		const result = Users.find(user => user.email === email && user.password === password);
		if (result != null) {
			localStorage.setItem('user', result.user);
			navigate('/userProfile');
			setAlert(`${lang.welcomeMessage} ${result.user}!`, AlertTypes.SUCCESS);
		} else {
			setAlert(`${lang.loginErrorMessage}`, AlertTypes.ERROR);
		}
	};

	return (
		<FormLayout>
			<div className={styles.closeBtn}></div>
			<h3 className={styles.title}>{lang.loginTitle}</h3>
			<label htmlFor="email" className={styles.loginLabel}>
				{lang.email}
			</label>
			<input id="email" className={styles.loginInput} placeholder={lang.user} type="text" onChange={handleChange} />
			<label htmlFor="password" className={styles.loginLabel}>
				{lang.password}
			</label>
			<input id="password" className={styles.loginInput} placeholder={lang.password} type="password" onChange={handleChange} />
			<Button kind="primary" size="large" onClick={handleLogin}>
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
