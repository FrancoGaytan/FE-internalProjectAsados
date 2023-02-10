import React from 'react';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import PrivateFormLayout from '../../Components/macro/layout/PrivateFormLayout';
import { useTranslation } from '../../stores/LocalizationContext';

const RecoverKey = () => {
	const lang = useTranslation('recoverKey');

	return (
		<div>
			<PrivateFormLayout>
				<div className={styles.recoverKeyContainer}>
					<h1>{lang.newPassword}</h1>
					<p className={styles.mainDesc}>{lang.changeDescription}</p>
					<label htmlFor="Email" className={styles.emailLabel}>
						{lang.email}
					</label>
					<input className={styles.input} id="email" placeholder={lang.email} type="text" />
					<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }}>
						{lang.sendEmail}
					</Button>
				</div>
			</PrivateFormLayout>
		</div>
	);
};

export default RecoverKey;
