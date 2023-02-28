import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import React, { useRef, useState } from 'react';
import DragAndDrop from '../../Components/micro/DragAndDrop/DragAndDrop';

export interface UserProfileInterface {
	userImage?: File;
	userCbu?: string;
	userAlias?: string;
	userVegan?: boolean;
	userVegetarian?: boolean;
	userHypertensive?: boolean;
	userCeliac?: boolean;
}

const UserProfile = () => {
	const lang = useTranslation('userProfile');
	let emptyFile = undefined as unknown as File;

	const initialUser = {
		userImage: emptyFile,
		userCbu: '',
		userAlias: '',
		userVegan: false,
		userVegetarian: false,
		userHypertensive: false,
		userCeliac: false
	};
	
	const inputRef = useRef<HTMLInputElement>(null);
	const [user, setUser] = useState<UserProfileInterface>(initialUser);
	
	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		console.log(user);
	};

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		//Prevents deleting current image when user press Cancel in the dialog window
		if(target.files?.length && target.files.length > 0) {
			setUser({...user, userImage: target.files[0]})
		}
	}

	const setProfileImage = (file: File) => {
		console.log(user);
		setUser({...user, userImage: file})
		console.log(user);
	}

	return (
		<div className={styles.userProfileContainer}>
			<h1>{lang.profileTitle}</h1>
			<section className={styles.dataSection}>
				<div className={styles.firstColumnProfile}>
					<h3>{lang.personalData}</h3>
					<div className={styles.pictureRow}>
						<DragAndDrop setState={setProfileImage}>
							{ user.userImage !== undefined ? 
								<img src={URL.createObjectURL(user.userImage)} className={styles.userPicture} alt='selected'/> :
								<img src='/assets/pictures/profile.png' className={styles.userPicture} alt='placeholder'/>
							}
						</DragAndDrop>
						<p onClick={() => inputRef.current?.click()} style={{cursor: 'pointer'}}>{lang.editImg}</p>
						<input type="file" style={{display: 'none'}} onChange={handleFile} ref={inputRef} />
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
							setUser({ ...user, userCbu: e.target.value});
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
