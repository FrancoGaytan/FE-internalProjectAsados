import { useTranslation } from '../../stores/LocalizationContext';
import Button from '../../components/micro/Button/Button';
import FormLayout from '../../components/macro/layout/FormLayout';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginRequest } from '../../models/user';
import { useAuth } from '../../stores/AuthContext';
import styles from './styles.module.scss';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { browserName } from '../../utils/utilities';

export function Login(): JSX.Element {
	const navigate = useNavigate();
	const lang = useTranslation('login');
	const { login, isLoading } = useAuth();
	const [showPassword, setShowPassword] = useState<boolean>(true);
	const inputPassword = useRef<HTMLInputElement | null>(null);
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

			<section className={styles.inputPasswordSection}>
				<input
					id="password"
					ref={inputPassword}
					className={styles.loginInput}
					placeholder={lang.password}
					type={browserName === 'Edge' ? 'password' : showPassword ? 'password' : 'text'}
					onChange={e => handleChange(e)}
					value={loginCredentials.password}
				/>
				{browserName !== 'Edge' && (
					<div
						className={styles.passwordEye}
						onClick={() => {
							setShowPassword(!showPassword);
							setTimeout(() => {
								if (inputPassword.current) {
									inputPassword.current.focus();
									const length = inputPassword.current.value.length;
									inputPassword.current.setSelectionRange(length, length);
								}
							}, 0);
						}}></div>
				)}
				{browserName !== 'Edge' && !showPassword && <div className={styles.passwordEyeCrossedLine}></div>}
			</section>

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
