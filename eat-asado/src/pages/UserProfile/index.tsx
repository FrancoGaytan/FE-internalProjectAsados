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
	specialDiet?: string[];
}

export function UserProfile(): JSX.Element {
	const lang = useTranslation('userProfile');
	const [actualUser, setActualUser] = useState<IUserByIdResponse>({
		email: '',
		name: '',
		password: '',
		specialDiet: []
	}); //este es el user que se utiliza para comparar la response del getUserById y despues actualizar el userProfile
	const { user } = useAuth(); // usuario que llega primero desde el useAuth
	const inputRef = useRef<HTMLInputElement>(null);

	// En un futuro esto debería estar en estado, para poder cambiarle el valor.
	let emptyFile = undefined as unknown as File;

	const initialUser = {
		userImage: emptyFile,
		userCbu: '',
		userAlias: '',
		userVegan: chekingSpecialDiet('vegan'),
		userVegetarian: chekingSpecialDiet('vegetarian'),
		userHypertensive: chekingSpecialDiet('hypertensive'),
		userCeliac: chekingSpecialDiet('celiac')
	};

	const [userProfle, setUser] = useState<UserProfileInterface>(initialUser); //este es el usuario que despues se va a submitear al form, el que se ve en los inputs
	const { setIsLoading } = useAuth();
	const { setAlert } = useAlert();
	const navigate = useNavigate();

	const checkSpecialDiet = (): string[] => {
		let speDiet = [];
		userProfle.userVegan && speDiet.push('vegan');
		userProfle.userVegetarian && speDiet.push('vegetarian');
		userProfle.userHypertensive && speDiet.push('hypertensive');
		userProfle.userCeliac && speDiet.push('celiac');

		return speDiet;
	};

	function handleUpdateProfile(e: any): void {
		e.preventDefault();
		setIsLoading(true);

		const provisionalSendingUser = {
			//TODO: Cuando el back acepte el archivo de foto de perfil hay que mandar directamente el userProfile
			cbu: userProfle.userCbu,
			alias: userProfle.userAlias,
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
			setUser({ ...userProfle, userImage: target.files[0] });
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
	console.log(actualUser);
	return (
		<div className={styles.userProfileContainer}>
			<form onSubmit={e => handleUpdateProfile(e)}>
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
					<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: 30 }}>
						{lang.saveBtn}
					</Button>
				</div>
			</form>
		</div>
	);
}
