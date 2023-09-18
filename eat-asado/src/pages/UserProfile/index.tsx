import styles from './styles.module.scss';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import React, { useEffect, useRef, useState } from 'react';
import DragAndDrop from '../../components/micro/DragAndDrop/DragAndDrop';
import { useAuth } from '../../stores/AuthContext';
import { editUser, getUserById } from '../../service';
import FormLayout from '../../components/macro/layout/FormLayout';
import { useAlert } from '../../stores/AlertContext';
import { useNavigate } from 'react-router-dom';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';

export interface UserProfileInterface {
	userImage?: File;
	userName?: string;
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
	password?: string;
	cbu?: string;
	alias?: string;
	specialDiet?: string[];
}

export function UserProfile(): JSX.Element {
	const lang = useTranslation('userProfile');
	const [actualUser, setActualUser] = useState<IUserByIdResponse>({
		email: '',
		name: '',
		alias: '',
		cbu: '',
		password: '',
		specialDiet: []
	}); //este es el user que se utiliza para comparar la response del getUserById y despues actualizar el userProfile
	const { user } = useAuth(); // usuario que llega primero desde el useAuth
	const inputRef = useRef<HTMLInputElement>(null);

	// En un futuro esto debería estar en estado, para poder cambiarle el valor.
	let emptyFile = undefined as unknown as File;

	const initialUser = {
		userImage: emptyFile,
		userName: '',
		userCbu: '',
		userAlias: '',
		userVegan: chekingSpecialDiet('vegan'),
		userVegetarian: chekingSpecialDiet('vegetarian'),
		userHypertensive: chekingSpecialDiet('hypertensive'),
		userCeliac: chekingSpecialDiet('celiac')
	};

	const [userProfile, setUser] = useState<UserProfileInterface>(initialUser); //este es el usuario que despues se va a submitear al form, el que se ve en los inputs
	const { setIsLoading } = useAuth();
	const { setAlert } = useAlert();
	const navigate = useNavigate();

	const checkSpecialDiet = (): string[] => {
		let speDiet = [];
		userProfile.userVegan && speDiet.push('vegan');
		userProfile.userVegetarian && speDiet.push('vegetarian');
		userProfile.userHypertensive && speDiet.push('hypertensive');
		userProfile.userCeliac && speDiet.push('celiac');

		return speDiet;
	};

	function handleUpdateProfile(e: any): void {
		e.preventDefault();
		setIsLoading(true);

		const provisionalSendingUser = {
			//TODO: Cuando el back acepte el archivo de foto de perfil hay que mandar directamente el userProfile
			name: userProfile.userName,
			cbu: userProfile.userCbu ? userProfile.userCbu : actualUser.cbu,
			alias: userProfile.userAlias ? userProfile.userAlias : actualUser.alias,
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

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		//Prevents deleting current image when user press Cancel in the dialog window
		if (target.files?.length && target.files.length > 0) {
			setUser({ ...userProfile, userImage: target.files[0] });
		}
	};

	const setProfileImage = (file: File) => {
		setUser(prev => ({ ...prev, userImage: file }));
		// setUser({userImage: file})
	};

	useEffect(() => {
		setUser(initialUser);
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
							placeholder={actualUser.cbu}
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
							placeholder={actualUser.alias}
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
							placeholder={actualUser.name}
							type="text"
							value={userProfile.userName}
							onChange={e => {
								setUser({ ...userProfile, userName: e.target.value });
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
