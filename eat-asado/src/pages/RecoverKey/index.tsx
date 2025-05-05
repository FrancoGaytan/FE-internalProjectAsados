import { JSX, useState } from 'react';
import Button from '../../components/micro/Button/Button';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import { useTranslation } from '../../stores/LocalizationContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { useAlert } from '../../stores/AlertContext';
import { forgotPassword } from '../../service/password';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';

export function RecoverKey(): JSX.Element {
	const lang = useTranslation('recoverKey');
	const [userEmail, setUserEmail] = useState('');
	const { setAlert } = useAlert();
	const navigate = useNavigate();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setUserEmail(e.target.value);
	}

	async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			await forgotPassword({ email: userEmail });
			setAlert(`${lang.emailSentConfirmation}`, AlertTypes.INFO);
			navigate('/settingNewPassword');
		} catch (e) {
			setAlert('error', AlertTypes.ERROR);
		}
	}

	return (
		<div>
			<PrivateFormLayout>
				<div className={styles.recoverKeyContainer}>
					<h1>{lang.newPassword}</h1>

					<p className={styles.mainDesc}>{lang.changeDescription}</p>

					<label htmlFor="Email" className={styles.emailLabel}>
						{lang.email}
					</label>

					<input className={styles.input} id="email" placeholder={lang.email} type="text" value={userEmail} onChange={handleChange} />

					<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }} onClick={handleSubmit}>
						{lang.sendEmail}
					</Button>
				</div>
			</PrivateFormLayout>
		</div>
	);
}
