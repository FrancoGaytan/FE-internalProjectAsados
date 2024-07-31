import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import React, { useEffect, useRef, useState } from 'react';
import DragAndDrop from '../../components/micro/DragAndDrop/DragAndDrop';
import { useAuth } from '../../stores/AuthContext';
import { editUser, getUserById } from '../../service';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import styles from './styles.module.scss';

export interface UserProfileInterface {
	userImage?: File;
	userName?: string;
	lastName?: string;
	userCbu?: string;
	userAlias?: string;
	userVegan?: boolean;
	userVegetarian?: boolean;
	userHypertensive?: boolean;
	userCeliac?: boolean;
}

export interface IUserByIdResponse {
	email?: string;
	name?: string;
	lastName?: string;
	password?: string;
	cbu?: string;
	alias?: string;
	specialDiet?: string[];
}

// En un futuro esto debería estar en estado, para poder cambiarle el valor.
const emptyFile = undefined as unknown as File;

export function UserProfile(): JSX.Element {
	const lang = useTranslation('userProfile');
	const { user, setIsLoading } = useAuth(); // usuario que llega primero desde el useAuth
	const { setAlert } = useAlert();
	const [actualUser, setActualUser] = useState<IUserByIdResponse>({
		email: '',
		name: '',
		lastName: '',
		alias: '',
		cbu: '',
		password: '',
		specialDiet: []
	}); //este es el user que se utiliza para comparar la response del getUserById y despues actualizar el userProfile
	const inputRef = useRef<HTMLInputElement>(null);

	const initialUser = {
		userImage: emptyFile,
		userName: actualUser.name,
		lastName: actualUser.lastName,
		userCbu: actualUser.cbu,
		userAlias: actualUser.alias,
		userVegan: chekingSpecialDiet('vegan'),
		userVegetarian: chekingSpecialDiet('vegetarian'),
		userHypertensive: chekingSpecialDiet('hypertensive'),
		userCeliac: chekingSpecialDiet('celiac')
	};

	const [userProfile, setUser] = useState<UserProfileInterface>(initialUser); //este es el usuario que despues se va a submitear al form, el que se ve en los inputs

	function checkSpecialDiet(): string[] {
		let speDiet = [];
		userProfile.userVegan && speDiet.push('vegan');
		userProfile.userVegetarian && speDiet.push('vegetarian');
		userProfile.userHypertensive && speDiet.push('hypertensive');
		userProfile.userCeliac && speDiet.push('celiac');

		return speDiet;
	}

	function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		setIsLoading(true);

		const provisionalSendingUser = {
			//TODO: Cuando el back acepte el archivo de foto de perfil hay que mandar directamente el userProfile
			name: userProfile.userName,
			lastName: userProfile.lastName,
			cbu: userProfile.userCbu,
			alias: userProfile.userAlias,
			specialDiet: checkSpecialDiet()
		};

		editUser(user?.id, provisionalSendingUser)
			.then(res => {
				setAlert(`${lang.successMsg}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.failureMsg}`, AlertTypes.ERROR))
			.finally(() => setIsLoading(false));
	}

	function chekingSpecialDiet(diet: any) {
		return actualUser?.specialDiet?.includes(diet) && diet.toString();
	}

	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		//Prevents deleting current image when user press Cancel in the dialog window
		if (target.files?.length && target.files.length > 0) {
			setUser({ ...userProfile, userImage: target.files[0] });
		}
	}

	function setProfileImage(file: File) {
		setUser(prev => ({ ...prev, userImage: file }));
		// setUser({userImage: file})
	}

	useEffect(() => {
		setUser(initialUser);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actualUser]);

	useEffect(() => {
		if (!user?.id) return;
		const abortController = new AbortController();

		getUserById(user.id).then(res => setActualUser(res));

		return () => abortController.abort();
	}, [user?.id]);

	return (
		<div className={styles.userProfileContainer}>
			<form onSubmit={e => handleUpdateProfile(e)}>
				<h1>{lang.profileTitle}</h1>

				<section className={styles.dataSection}>
					<div className={styles.firstColumnProfile}>
						<h3>{lang.personalData}</h3>

						<div className={styles.pictureRow}>
							<DragAndDrop setState={setProfileImage}>
								{userProfile.userImage !== undefined ? (
									<img src={URL.createObjectURL(userProfile.userImage)} className={styles.userPicture} alt="selected" />
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
							type="text"
							value={userProfile.userCbu}
							onChange={e => {
								setUser({ ...userProfile, userCbu: e.target.value });
							}}
						/>

						<label htmlFor="alias" className={styles.cbuLabel}>
							{lang.alias}
						</label>
						<input
							className={styles.input}
							id="alias"
							type="text"
							value={userProfile.userAlias}
							onChange={e => {
								setUser({ ...userProfile, userAlias: e.target.value });
							}}
						/>

						<label htmlFor="name" className={styles.cbuLabel}>
							{lang.name}
						</label>
						<input
							className={styles.input}
							id="name"
							type="text"
							value={userProfile.userName}
							onChange={e => {
								setUser({ ...userProfile, userName: e.target.value });
							}}
						/>
						<label htmlFor="lastName" className={styles.cbuLabel}>
							{lang.lastName}
						</label>
						<input
							className={styles.input}
							id="lastName"
							type="text"
							value={userProfile.lastName}
							onChange={e => {
								setUser({ ...userProfile, lastName: e.target.value });
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
									checked={userProfile.userVegan}
									onChange={e => {
										setUser({ ...userProfile, userVegan: e.target.checked });
									}}
								/>
								{lang.veganDiet}
							</label>

							<label className={styles.profileLabel}>
								<input
									id="isVegetarian"
									type="checkbox"
									className={styles.checkbox}
									checked={userProfile.userVegetarian}
									onChange={e => {
										setUser({ ...userProfile, userVegetarian: e.target.checked });
									}}
								/>
								{lang.vegetarianDiet}
							</label>

							<label className={styles.profileLabel}>
								<input
									id="isHypertensive"
									type="checkbox"
									className={styles.checkbox}
									checked={userProfile.userHypertensive}
									onChange={e => {
										setUser({ ...userProfile, userHypertensive: e.target.checked });
									}}
								/>
								{lang.hypertensiveDiet}
							</label>
							<label className={styles.profileLabel}>
								<input
									id="isCeliac"
									type="checkbox"
									className={styles.checkbox}
									checked={userProfile.userCeliac}
									onChange={e => {
										setUser({ ...userProfile, userCeliac: e.target.checked });
									}}
								/>
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
			</form>
		</div>
	);
}
