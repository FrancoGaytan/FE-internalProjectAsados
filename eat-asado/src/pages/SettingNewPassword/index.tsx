import { useRef, useState } from 'react';
import styles from './styles.module.scss';
import Button from '../../components/micro/Button/Button';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import { useTranslation } from '../../stores/LocalizationContext';
import { recoverPassword, verifyCode } from '../../service/password';
import { useNavigate } from 'react-router-dom';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { useAlert } from '../../stores/AlertContext';
import { browserName } from '../../utils/utilities';

interface InitialNewPasswordInterface {
	userEmail: string;
	userVerificationCode: string;
	userPassword: string;
	userConfirmedPassword: string;
}

export function SettingNewPassword(): JSX.Element {
	const lang = useTranslation('settingNewPassword');
	const navigate = useNavigate();
	const { setAlert } = useAlert();
	const [showPassword, setShowPassword] = useState<boolean>(true); //TODO: componentizar el input tipo password, ahí no repetimos esto en las 3 páginas
	const [showConfirmedPassword, setShowConfirmedPassword] = useState<boolean>(true);
	const inputPassword = useRef<HTMLInputElement | null>(null);
	const inputConfirmedPassword = useRef<HTMLInputElement | null>(null);
	const [newPassword, setNewPassword] = useState<InitialNewPasswordInterface>({
		userEmail: '',
		userVerificationCode: '',
		userPassword: '',
		userConfirmedPassword: ''
	});

	function validatePassword(password: string): boolean {
		const expReg = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$');
		return expReg.test(password);
	}

	async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		if (newPassword.userPassword !== newPassword.userConfirmedPassword) {
			setAlert(lang.passwordsDontMatch, AlertTypes.ERROR);
			return;
		}
		if (!validatePassword(newPassword.userPassword)) {
			setAlert(`${lang.wrongPassword}`, AlertTypes.ERROR);
			return;
		}
		try {
			await verifyCode({ email: newPassword.userEmail, verificationCode: newPassword.userVerificationCode });

			try {
				await recoverPassword({
					email: newPassword.userEmail,
					verificationCode: newPassword.userVerificationCode,
					password: newPassword.userPassword
				});
				setAlert(lang.emailChangedSuccessfully, AlertTypes.INFO);
				setTimeout(() => navigate('/login'), 1000);
			} catch (e) {
				setAlert(lang.couldntUpdatePassword, AlertTypes.ERROR);
			}
		} catch (e) {
			setAlert(lang.couldntUpdatePassword, AlertTypes.ERROR);
		}
	}

	return (
		<div>
			<PrivateFormLayout>
				<div className={styles.settingNewPasswordContainer}>
					<h1>{lang.setNewPasswordTitle}</h1>

					<label htmlFor="email" className={styles.passwordLabel}>
						{lang.email}
					</label>

					<input
						className={styles.input}
						id="email"
						placeholder={lang.email}
						type="text"
						value={newPassword.userEmail}
						onChange={e => {
							setNewPassword({ ...newPassword, userEmail: e.target.value });
						}}
					/>

					<label htmlFor="verificationCode" className={styles.passwordLabel}>
						{lang.verificationCode}
					</label>

					<input
						className={styles.input}
						id="verificationCode"
						placeholder={lang.verificationCode}
						type="text"
						value={newPassword.userVerificationCode}
						onChange={e => {
							setNewPassword({ ...newPassword, userVerificationCode: e.target.value });
						}}
					/>

					<label htmlFor="Password" className={styles.passwordLabel}>
						{lang.password}
					</label>
					<section className={styles.inputPasswordSection}>
						<input
							className={styles.input}
							id="password"
							ref={inputPassword}
							placeholder={lang.password}
							type={browserName === 'Edge' ? 'password' : showPassword ? 'password' : 'text'}
							value={newPassword.userPassword}
							onChange={e => {
								setNewPassword({ ...newPassword, userPassword: e.target.value });
							}}
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

					<p className={styles.mainDesc}>{lang.passwordDescription}</p>

					<label htmlFor="Password" className={styles.passwordLabel}>
						{lang.confirmPassword}
					</label>

					<section className={styles.inputPasswordSection}>
						<input
							className={styles.input}
							id="confirmPassword"
							ref={inputConfirmedPassword}
							placeholder={lang.confirmPassword}
							type={browserName === 'Edge' ? 'password' : showConfirmedPassword ? 'password' : 'text'}
							value={newPassword.userConfirmedPassword}
							onChange={e => {
								setNewPassword({ ...newPassword, userConfirmedPassword: e.target.value });
							}}
						/>
						{browserName !== 'Edge' && (
							<div
								className={styles.passwordEye}
								onClick={() => {
									setShowConfirmedPassword(!showConfirmedPassword);
									setTimeout(() => {
										if (inputConfirmedPassword.current) {
											inputConfirmedPassword.current.focus();
											const length = inputConfirmedPassword.current.value.length;
											inputConfirmedPassword.current.setSelectionRange(length, length);
										}
									}, 0);
								}}></div>
						)}
						{browserName !== 'Edge' && !showConfirmedPassword && <div className={styles.passwordEyeCrossedLine}></div>}
					</section>

					<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }} onClick={handleSubmit}>
						{lang.setKeyBtn}
					</Button>
				</div>
			</PrivateFormLayout>
		</div>
	);
}
