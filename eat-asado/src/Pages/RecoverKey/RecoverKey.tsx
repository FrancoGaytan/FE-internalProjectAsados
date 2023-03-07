import React, { useState } from 'react';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import PrivateFormLayout from '../../Components/macro/layout/PrivateFormLayout';
import { useTranslation } from '../../stores/LocalizationContext';

const RecoverKey = () => {
	const lang = useTranslation('recoverKey');
	const [userEmail, setUserEmail] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserEmail(e.target.value);
	}

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(userEmail);
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
					<input 
						className={styles.input} 
						id="email" 
						placeholder={lang.email} 
						type="text" 
						value={userEmail} 
						onChange={handleChange}/>
					<Button 
						kind="primary" 
						size="large" 
						id="registerBtn" 
						style={{ marginBottom: 30 }} 
						onClick={handleSubmit}>
							{lang.sendEmail}
					</Button>
				</div>
			</PrivateFormLayout>
		</div>
	);
};

export default RecoverKey;
