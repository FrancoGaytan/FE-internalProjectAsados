import React from 'react';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import PrivateFormLayout from '../../Components/macro/layout/PrivateFormLayout';

const UserProfile = () => {
	return (
		<div>
			<PrivateFormLayout>
				<div className={styles.userProfileContainer}>
					<h1>Perfil de Usuario</h1>
				</div>
			</PrivateFormLayout>
		</div>
	);
};

export default UserProfile;
