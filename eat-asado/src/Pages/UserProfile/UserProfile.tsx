import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';

const UserProfile = () => {
	const lang = useTranslation('userProfile');
	return (
		<div className={styles.userProfileContainer}>
			<h1>{lang.profileTitle}</h1>
			<section className={styles.dataSection}>
				<div className={styles.firstColumnProfile}>
					<h3>{lang.personalData}</h3>
					<div className={styles.pictureRow}>
						<div className={styles.userPicture}></div>
						<p>{lang.editImg}</p>
					</div>
					<label htmlFor="cbu" className={styles.cbuLabel}>
						{lang.cbu}
					</label>
					<input className={styles.input} id="cbu" placeholder={lang.cbu} type="text" />
					<label htmlFor="aliasCbu" className={styles.cbuLabel}>
						{lang.alias}
					</label>
					<input className={styles.input} id="aliasCbu" placeholder={lang.alias} type="text" />
				</div>
				<div className={styles.secondColumnProfile}>
					<h3>{lang.specialDietTitle}</h3>
					<section className={styles.checkboxesContainer}>
						<label className={styles.profileLabel}>
							<input id="isVegan" type="checkbox" className={styles.checkbox} />
							{lang.veganDiet}
						</label>

						<label className={styles.profileLabel}>
							<input id="isVegetarian" type="checkbox" className={styles.checkbox} />
							{lang.vegetarianDiet}
						</label>

						<label className={styles.profileLabel}>
							<input id="isHypertensive" type="checkbox" className={styles.checkbox} />
							{lang.hypertensiveDiet}
						</label>
						<label className={styles.profileLabel}>
							<input id="isCeliac" type="checkbox" className={styles.checkbox} />
							{lang.celiacDiet}
						</label>
					</section>
				</div>
			</section>
			<div className={styles.btnSection}>
				<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }}>
					{lang.saveBtn}
				</Button>
			</div>
		</div>
	);
};

export default UserProfile;
