import React from 'react';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import PrivateFormLayout from '../../Components/macro/layout/PrivateFormLayout';

const RecoverKey = () => {
	return (
		<div>
			<PrivateFormLayout>
				<div className={styles.recoverKeyContainer}>
					<h1>Cambio de Contraseña</h1>
					<p className={styles.mainDesc}>Enviaremos un link a tu correo de endava y te permitira resetear tu clave</p>
					<label htmlFor="Email" className={styles.emailLabel}>
						Email
					</label>
					<input className={styles.input} id="email" placeholder="Email" type="text" />
					<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }}>
						RECUPERAR CLAVE
					</Button>
				</div>
			</PrivateFormLayout>
		</div>
	);
};

export default RecoverKey;
