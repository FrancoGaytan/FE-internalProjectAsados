import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import { useState } from 'react';

interface UserProfileInterface {
	userImage?: any;
	userCbu?: number;
	userAlias?: string;
	userVegan?: boolean;
	userVegetarian?: boolean;
	userHypertensive?: boolean;
	userCeliac?: boolean;
}

const UserProfile = () => {
	const lang = useTranslation('userProfile');
	const initialUser = {
		userImage: '',
		userCbu: undefined,
		userAlias: '',
		userVegan: false,
		userVegetarian: false,
		userHypertensive: false,
		userCeliac: false
	};

	const [user, setUser] = useState<UserProfileInterface>(initialUser);

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(user);
	};

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
					<input
						className={styles.input}
						id="cbu"
						placeholder={lang.cbu}
						type="text"
						value={user.userCbu}
						onChange={e => {
							setUser({ ...user, userCbu: Number(e.target.value) });
						}}
					/>
					<label htmlFor="alias" className={styles.cbuLabel}>
						{lang.alias}
					</label>
					<input
						className={styles.input}
						id="alias"
						placeholder={lang.alias}
						type="text"
						value={user.userAlias}
						onChange={e => {
							setUser({ ...user, userAlias: e.target.value });
						}}
					/>
				</div>
				<div className={styles.secondColumnProfile}>
					<h3>{lang.specialDietTitle}</h3>
					<section className={styles.checkboxesContainer}>
						<label className={styles.profileLabel}>
							<input
								id="isVegan"
								type="checkbox"
								className={styles.checkbox}
								checked={user.userVegan}
								onChange={e => {
									setUser({ ...user, userVegan: e.target.checked });
								}}
							/>
							{lang.veganDiet}
						</label>

						<label className={styles.profileLabel}>
							<input
								id="isVegetarian"
								type="checkbox"
								className={styles.checkbox}
								checked={user.userVegetarian}
								onChange={e => {
									setUser({ ...user, userVegetarian: e.target.checked });
								}}
							/>
							{lang.vegetarianDiet}
						</label>

						<label className={styles.profileLabel}>
							<input
								id="isHypertensive"
								type="checkbox"
								className={styles.checkbox}
								checked={user.userHypertensive}
								onChange={e => {
									setUser({ ...user, userHypertensive: e.target.checked });
								}}
							/>
							{lang.hypertensiveDiet}
						</label>
						<label className={styles.profileLabel}>
							<input
								id="isCeliac"
								type="checkbox"
								className={styles.checkbox}
								checked={user.userCeliac}
								onChange={e => {
									setUser({ ...user, userCeliac: e.target.checked });
								}}
							/>
							{lang.celiacDiet}
						</label>
					</section>
				</div>
			</section>
			<div className={styles.btnSection}>
				<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }} onClick={handleSubmit}>
					{lang.saveBtn}
				</Button>
			</div>
		</div>
	);
};

export default UserProfile;
