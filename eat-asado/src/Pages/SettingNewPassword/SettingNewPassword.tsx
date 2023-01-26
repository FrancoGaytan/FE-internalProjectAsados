import React from 'react';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import PrivateFormLayout from '../../Components/macro/layout/PrivateFormLayout';

const SettingNewPassword = () => {
	return (
		<div>
			<PrivateFormLayout>
				<div className={styles.userProfileContainer}>
					<h1>Setear Nueva Contraseña </h1>
				</div>
			</PrivateFormLayout>
		</div>
	);
};

export default SettingNewPassword;
