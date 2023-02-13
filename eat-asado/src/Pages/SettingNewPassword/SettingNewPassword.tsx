import React from 'react';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import PrivateFormLayout from '../../Components/macro/layout/PrivateFormLayout';
import { useTranslation } from '../../stores/LocalizationContext';

const SettingNewPassword = () => {
	const lang = useTranslation('settingNewPassword');
	return (
		<div>
			<PrivateFormLayout>
				<div className={styles.settingNewPasswordContainer}>
					<h1>{lang.setNewPasswordTitle}</h1>
					<label htmlFor="Password" className={styles.passwordLabel}>
						{lang.password}
					</label>
					<input className={styles.input} id="password" placeholder={lang.password} type="password" />
					<p className={styles.mainDesc}>{lang.passwordDescription}</p>
					<label htmlFor="Password" className={styles.passwordLabel}>
						{lang.confirmPassword}
					</label>
					<input className={styles.input} id="confirmPassword" placeholder={lang.confirmPassword} type="password" />
					<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }}>
						{lang.setKeyBtn}
					</Button>
				</div>
			</PrivateFormLayout>
		</div>
	);
};

export default SettingNewPassword;
