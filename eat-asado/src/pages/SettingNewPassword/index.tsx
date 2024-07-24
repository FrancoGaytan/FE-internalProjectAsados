import { useState } from 'react';
import styles from './styles.module.scss';
import Button from '../../components/micro/Button/Button';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import { useTranslation } from '../../stores/LocalizationContext';
import { recoverPassword, verifyCode } from '../../service/password';
import { useNavigate } from 'react-router-dom';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { useAlert } from '../../stores/AlertContext';

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
	const [newPassword, setNewPassword] = useState<InitialNewPasswordInterface>({
		userEmail: '',
		userVerificationCode: '',
		userPassword: '',
		userConfirmedPassword: ''
	});

	function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		if (newPassword.userPassword !== newPassword.userConfirmedPassword) {
			setAlert(lang.passwordsDontMatch, AlertTypes.ERROR);
			return;
		}
		try {
			verifyCode({ email: newPassword.userEmail, verificationCode: newPassword.userVerificationCode });

			try {
				recoverPassword({
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

					<input
						className={styles.input}
						id="password"
						placeholder={lang.password}
						type="password"
						value={newPassword.userPassword}
						onChange={e => {
							setNewPassword({ ...newPassword, userPassword: e.target.value });
						}}
					/>

					<p className={styles.mainDesc}>{lang.passwordDescription}</p>

					<label htmlFor="Password" className={styles.passwordLabel}>
						{lang.confirmPassword}
					</label>

					<input
						className={styles.input}
						id="confirmPassword"
						placeholder={lang.confirmPassword}
						type="password"
						value={newPassword.userConfirmedPassword}
						onChange={e => {
							setNewPassword({ ...newPassword, userConfirmedPassword: e.target.value });
						}}
					/>

					<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }} onClick={handleSubmit}>
						{lang.setKeyBtn}
					</Button>
				</div>
			</PrivateFormLayout>
		</div>
	);
}
