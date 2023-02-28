import { useState } from 'react';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import PrivateFormLayout from '../../Components/macro/layout/PrivateFormLayout';
import { useTranslation } from '../../stores/LocalizationContext';

interface InitialNewPasswordInterface {
	userVerificationCode: string;
	userPassword: string;
	userConfirmedPassword: string;
}

const SettingNewPassword = () => {
	const lang = useTranslation('settingNewPassword');
	const initialNewPassword = {
		userVerificationCode: '',
		userPassword: '',
		userConfirmedPassword: ''
	};
	const [newPassword, setNewPassword] = useState<InitialNewPasswordInterface>(initialNewPassword);

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(newPassword);
	};

	return (
		<div>
			<PrivateFormLayout>
				<div className={styles.settingNewPasswordContainer}>
					<h1>{lang.setNewPasswordTitle}</h1>
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
};

export default SettingNewPassword;
