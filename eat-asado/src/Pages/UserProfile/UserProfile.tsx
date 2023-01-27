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
					<section className={styles.dataSection}>
						<div className={styles.firstColumnProfile}>
							<div className={styles.userPicture}></div>
							<label htmlFor="cbu" className={styles.cbuLabel}>
								CBU
							</label>
							<input className={styles.input} id="cbu" placeholder="cbu" type="text" />
							<label htmlFor="aliasCbu" className={styles.cbuLabel}>
								Alias CBU
							</label>
							<input className={styles.input} id="aliasCbu" placeholder="Alias CBU" type="text" />
						</div>
						<div className={styles.secondColumnProfile}></div>
					</section>
				</div>
			</PrivateFormLayout>
		</div>
	);
};

export default UserProfile;
