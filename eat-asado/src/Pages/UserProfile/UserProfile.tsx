import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';

const UserProfile = () => {
	return (
		<div className={styles.userProfileContainer}>
			<h1>Editar Usuario</h1>
			<section className={styles.dataSection}>
				<div className={styles.firstColumnProfile}>
					<h3>Perfil de Usuario</h3>
					<div className={styles.pictureRow}>
						<div className={styles.userPicture}></div>
						<p>Editar Imagen</p>
					</div>
					<label htmlFor="cbu" className={styles.cbuLabel}>
						CBU
					</label>
					<input className={styles.input} id="cbu" placeholder="cbu" type="text" />
					<label htmlFor="aliasCbu" className={styles.cbuLabel}>
						Alias CBU
					</label>
					<input className={styles.input} id="aliasCbu" placeholder="Alias CBU" type="text" />
				</div>
				<div className={styles.secondColumnProfile}>
					<h3>Preferencias Alimenticias</h3>
					<section className={styles.checkboxesContainer}>
						<label className={styles.profileLabel}>
							<input id="isVegan" type="checkbox" className={styles.checkbox} />
							Sos Vegano?
						</label>

						<label className={styles.profileLabel}>
							<input id="isVegetarian" type="checkbox" className={styles.checkbox} />
							Sos Vegetariano?
						</label>

						<label className={styles.profileLabel}>
							<input id="isHypertensive" type="checkbox" className={styles.checkbox} />
							Sos Hipertenso?
						</label>
						<label className={styles.profileLabel}>
							<input id="isCeliac" type="checkbox" className={styles.checkbox} />
							Sos Celíaco?
						</label>
					</section>
				</div>
			</section>
			<div className={styles.btnSection}>
				<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }}>
					GUARDAR
				</Button>
			</div>
		</div>
	);
};

export default UserProfile;
