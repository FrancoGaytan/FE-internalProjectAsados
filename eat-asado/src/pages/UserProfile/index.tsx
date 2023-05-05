import styles from './styles.module.scss';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import React, { useRef, useState } from 'react';
import DragAndDrop from '../../components/micro/DragAndDrop/DragAndDrop';
import { useAuth } from '../../stores/AuthContext';
import { editUser } from '../../service';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';

export interface UserProfileInterface {
	userImage?: File;
	userName?: string;
	userEmail?: string;
	userCbu?: string;
	userAlias?: string;
	userVegan?: boolean;
	userVegetarian?: boolean;
	userHypertensive?: boolean;
	userCeliac?: boolean;
}

export function UserProfile(): JSX.Element {
	const lang = useTranslation('userProfile');
	const { user, isLoading, setIsLoading } = useAuth();
	const { setAlert } = useAlert();
	let emptyFile = undefined as unknown as File;

	const initialUser: UserProfileInterface = {
		userImage: emptyFile,
		userName: '',
		/* userEmail: user?.email, */
		userEmail: 'prueba@endava.com',
		userCbu: '',
		userAlias: '',
		userVegan: false,
		userVegetarian: false,
		userHypertensive: false,
		userCeliac: false
	};

	const inputRef = useRef<HTMLInputElement>(null);
	const [updatedUser, setUser] = useState<UserProfileInterface>(initialUser);

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		//Prevents deleting current image when user press Cancel in the dialog window
		if (target.files?.length && target.files.length > 0) {
			setUser({ ...updatedUser, userImage: target.files[0] });
		}
	};

	const setProfileImage = (file: File) => {
		setUser(prev => ({ ...prev, userImage: file }));
		// setUser({userImage: file})
	};

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		const specialDietInputs = [updatedUser.userVegan, updatedUser.userVegetarian, updatedUser.userHypertensive, updatedUser.userCeliac];
		const payloadObject = { cbu: updatedUser.userCbu, alias: updatedUser.userAlias, name: updatedUser.userName, specialDiet: specialDietInputs };

		e.preventDefault();
		editUser(user?.id, payloadObject)
			.then(res => {
				setAlert(`${lang.updateSuccessMessage}`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.updateErrorMessage}`, AlertTypes.ERROR))
			.finally(() => setIsLoading(false));
		console.log(updatedUser);
	};

	return (
		<div className={styles.userProfileContainer}>
			<h1>{lang.profileTitle}</h1>
			<section className={styles.dataSection}>
				<div className={styles.firstColumnProfile}>
					<h3>{lang.personalData}</h3>
					<div className={styles.pictureRow}>
						<DragAndDrop setState={setProfileImage}>
							{updatedUser.userImage !== undefined ? (
								<img src={URL.createObjectURL(updatedUser.userImage)} className={styles.userPicture} alt="selected" />
							) : (
								<img src="/assets/pictures/profile.png" className={styles.userPicture} alt="placeholder" />
							)}
						</DragAndDrop>
						<p onClick={() => inputRef.current?.click()} style={{ cursor: 'pointer' }}>
							{lang.editImg}
						</p>
						<input type="file" style={{ display: 'none' }} onChange={handleFile} ref={inputRef} />
					</div>
					<label htmlFor="cbu" className={styles.cbuLabel}>
						{lang.cbu}
					</label>
					<input
						className={styles.input}
						id="cbu"
						/* placeholder={user?.cbu ? user?.cbu : lang.cbu} */
						type="text"
						value={updatedUser.userCbu}
						onChange={e => {
							setUser({ ...updatedUser, userCbu: e.target.value });
						}}
					/>
					<label htmlFor="alias" className={styles.cbuLabel}>
						{lang.alias}
					</label>
					<input
						className={styles.input}
						id="alias"
						/* placeholder={user?.alias ? user?.alias : lang.alias}  */
						type="text"
						value={updatedUser.userAlias}
						onChange={e => {
							setUser({ ...updatedUser, userAlias: e.target.value });
						}}
					/>
				</div>
				<div className={styles.secondColumnProfile}>
					<label htmlFor="name" className={styles.cbuLabel}>
						{lang.name}
					</label>
					<input
						className={styles.input}
						id="name"
						placeholder={user?.name ? user?.name : lang.name}
						type="text"
						value={updatedUser.userName}
						onChange={e => {
							setUser({ ...updatedUser, userName: e.target.value });
						}}
					/>
					<label htmlFor="email" className={styles.cbuLabel}>
						{lang.email}
					</label>
					<input className={styles.input} id="email" /* placeholder={user?.email} */ type="text" disabled /* value={user?.email} */ />

					<h3>{lang.specialDietTitle}</h3>
					<section className={styles.checkboxesContainer}>
						<label className={styles.profileLabel}>
							<input
								id="isVegan"
								type="checkbox"
								className={styles.checkbox}
								checked={updatedUser.userVegan}
								onChange={e => {
									setUser({ ...updatedUser, userVegan: e.target.checked });
								}}
							/>
							{lang.veganDiet}
						</label>

						<label className={styles.profileLabel}>
							<input
								id="isVegetarian"
								type="checkbox"
								className={styles.checkbox}
								checked={updatedUser.userVegetarian}
								onChange={e => {
									setUser({ ...updatedUser, userVegetarian: e.target.checked });
								}}
							/>
							{lang.vegetarianDiet}
						</label>

						<label className={styles.profileLabel}>
							<input
								id="isHypertensive"
								type="checkbox"
								className={styles.checkbox}
								checked={updatedUser.userHypertensive}
								onChange={e => {
									setUser({ ...updatedUser, userHypertensive: e.target.checked });
								}}
							/>
							{lang.hypertensiveDiet}
						</label>
						<label className={styles.profileLabel}>
							<input
								id="isCeliac"
								type="checkbox"
								className={styles.checkbox}
								checked={updatedUser.userCeliac}
								onChange={e => {
									setUser({ ...updatedUser, userCeliac: e.target.checked });
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
}
