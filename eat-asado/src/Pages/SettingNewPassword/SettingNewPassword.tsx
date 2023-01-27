import React from 'react';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import PrivateFormLayout from '../../Components/macro/layout/PrivateFormLayout';

const SettingNewPassword = () => {
	return (
		<div>
			<PrivateFormLayout>
				<div className={styles.settingNewPasswordContainer}>
					<h1>Setear Nueva Contraseña </h1>
					<label htmlFor="Password" className={styles.passwordLabel}>
						Contraseña
					</label>
					<input className={styles.input} id="password" placeholder="Password" type="password" />
					<p className={styles.mainDesc}>La clave debe ser alfanumerica y tener un mínimo de 8 caracteres</p>
					<label htmlFor="Password" className={styles.passwordLabel}>
						Confirmar Contraseña
					</label>
					<input className={styles.input} id="confirmPassword" placeholder="Confirm Password" type="password" />
					<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }}>
						SETEAR CLAVE
					</Button>
				</div>
			</PrivateFormLayout>
		</div>
	);
};

export default SettingNewPassword;
