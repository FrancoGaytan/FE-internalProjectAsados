import styles from './styles.module.scss';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import React, { useEffect, useRef, useState } from 'react';
import DragAndDrop from '../../components/micro/DragAndDrop/DragAndDrop';
import { useAuth } from '../../stores/AuthContext';
import { getUserById } from '../../service';

export interface UserProfileInterface {
	userImage?: File;
	userCbu?: string;
	userAlias?: string;
	userVegan?: boolean;
	userVegetarian?: boolean;
	userHypertensive?: boolean;
	userCeliac?: boolean;
}

export function UserProfile(): JSX.Element {
	const lang = useTranslation('userProfile');
	const [actualUser, setActualUser] = useState();
	const { user } = useAuth();

	// En un futuro esto debería estar en estado, para poder cambiarle el valor.
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
	const [userProfle, setUser] = useState<UserProfileInterface>(initialUser);

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		console.log(userProfle);
	};

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		//Prevents deleting current image when user press Cancel in the dialog window
		if (target.files?.length && target.files.length > 0) {
			setUser({ ...userProfle, userImage: target.files[0] });
		}
	};

	const setProfileImage = (file: File) => {
		setUser(prev => ({ ...prev, userImage: file }));
		// setUser({userImage: file})
	};

	// MOVI LOS EFECTOS ABAJO, POR UN TEMA DE CONVENCIÓN. (No se si cambia algo a nivel arquitectónico)
	// Este useEffect no está mal, pero no está comprobando que `user.id` exista. Por eso te va a fallar.

	/* useEffect(() => {
		const abortController = new AbortController();

		getUserById(user?.id, abortController.signal)
			.then(res => {
				setActualUser(res);
				console.log(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});

		return () => abortController.abort();
	}, [user?.id]);
 */
	/* 	console.log(user);
	console.log('usuario:' + actualUser); */

	useEffect(() => {
		if (!user?.id) return;
		const abortController = new AbortController();

		/**
		 * @param res trae la respuesta de la API, fijate que necesitas hacer con eso. De momento solo la estoy consologueando.
		 */
		getUserById(user.id).then(res => console.log(res));

		return () => abortController.abort();
	}, [user?.id]);

	return (
		<div className={styles.userProfileContainer}>
			<h1>{lang.profileTitle}</h1>
			<section className={styles.dataSection}>
				<div className={styles.firstColumnProfile}>
					<h3>{lang.personalData}</h3>
					<div className={styles.pictureRow}>
						<DragAndDrop setState={setProfileImage}>
							{userProfle.userImage !== undefined ? (
								<img src={URL.createObjectURL(userProfle.userImage)} className={styles.userPicture} alt="selected" />
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
						placeholder={lang.cbu}
						type="text"
						value={userProfle.userCbu}
						onChange={e => {
							setUser({ ...userProfle, userCbu: e.target.value });
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
						value={userProfle.userAlias}
						onChange={e => {
							setUser({ ...userProfle, userAlias: e.target.value });
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
								checked={userProfle.userVegan}
								onChange={e => {
									setUser({ ...userProfle, userVegan: e.target.checked });
								}}
							/>
							{lang.veganDiet}
						</label>

						<label className={styles.profileLabel}>
							<input
								id="isVegetarian"
								type="checkbox"
								className={styles.checkbox}
								checked={userProfle.userVegetarian}
								onChange={e => {
									setUser({ ...userProfle, userVegetarian: e.target.checked });
								}}
							/>
							{lang.vegetarianDiet}
						</label>

						<label className={styles.profileLabel}>
							<input
								id="isHypertensive"
								type="checkbox"
								className={styles.checkbox}
								checked={userProfle.userHypertensive}
								onChange={e => {
									setUser({ ...userProfle, userHypertensive: e.target.checked });
								}}
							/>
							{lang.hypertensiveDiet}
						</label>
						<label className={styles.profileLabel}>
							<input
								id="isCeliac"
								type="checkbox"
								className={styles.checkbox}
								checked={userProfle.userCeliac}
								onChange={e => {
									setUser({ ...userProfle, userCeliac: e.target.checked });
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
