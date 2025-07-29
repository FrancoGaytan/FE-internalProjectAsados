import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import React, { JSX, useEffect, useRef, useState } from 'react';
import DragAndDrop from '../../components/micro/DragAndDrop/DragAndDrop';
import { useAuth } from '../../stores/AuthContext';
import { editProfilePicture, editUser, getUserById } from '../../service';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import styles from './styles.module.scss';
import { getImage } from '../../service/purchaseReceipts';
import { INotificationOptions } from '../../models/user';
import { event } from '../../localization/en-us/event';

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
	alternativeEmail?: string;
	newEventNotification?: boolean;
	eventComingNotification?: boolean;
	penalizationStartedNotification?: boolean;
	oneWeekDebtorNotification?: boolean;
	notifications: INotificationOptions;
}

export interface IUserByIdResponse {
	email?: string;
	name?: string;
	lastName?: string;
	password?: string;
	cbu?: string;
	alias?: string;
	specialDiet?: string[];
	image?: any;
	alternativeEmail?: string;
	notifications: INotificationOptions;
}

// En un futuro esto debería estar en estado, para poder cambiarle el valor.
const emptyFile = undefined as unknown as File;

export function UserProfile(): JSX.Element {
	const lang = useTranslation('userProfile');
	const { user, setIsLoading } = useAuth();
	const { setAlert } = useAlert();
	const [activateNotifications, setActivateNotifications] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<IUserByIdResponse>({
		email: '',
		name: '',
		lastName: '',
		alias: '',
		cbu: '',
		password: '',
		specialDiet: [],
		image: emptyFile,
		alternativeEmail: '',
		notifications: {
			newEvent: false,
			eventStart: false,
			penalizationStart: false,
			penalizationOneWeek: false
		}
	}); //este es el user que se utiliza para comparar la response del getUserById y despues actualizar el userProfile
	const inputRef = useRef<HTMLInputElement>(null);

	const initialUser = {
		userImage: currentUser.image,
		userName: currentUser.name,
		lastName: currentUser.lastName,
		userCbu: currentUser.cbu,
		userAlias: currentUser.alias,
		userVegan: chekingSpecialDiet('vegan'),
		userVegetarian: chekingSpecialDiet('vegetarian'),
		userHypertensive: chekingSpecialDiet('hypertensive'),
		userCeliac: chekingSpecialDiet('celiac'),
		alternativeEmail: currentUser.alternativeEmail || '',
		notifications: {
			newEvent: currentUser.notifications.newEvent || false,
			eventStart: currentUser.notifications.eventStart || false,
			penalizationStart: currentUser.notifications.penalizationStart || false,
			penalizationOneWeek: currentUser.notifications.penalizationOneWeek || false
		}
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

	function checkForWrongFileType(file: File): Boolean {
		return file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg';
	}

	function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		setIsLoading(true);

		if (
			activateNotifications &&
			!userProfile.alternativeEmail &&
			(userProfile.newEventNotification ||
				userProfile.penalizationStartedNotification ||
				userProfile.eventComingNotification ||
				userProfile.oneWeekDebtorNotification)
		) {
			setAlert(lang.errorEmailRequired, AlertTypes.WARNING);
			return;
		}
		if (userProfile.alternativeEmail) {
			const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.alternativeEmail); //chequear si esta funcionando este test
			if (!isValid) {
				setAlert(lang.invalidEmail, AlertTypes.ERROR);
				return;
			}
		}
		const provisionalSendingUser = {
			//TODO: Cuando el back acepte el archivo de foto de perfil hay que mandar directamente el userProfile
			name: userProfile.userName,
			lastName: userProfile.lastName,
			cbu: userProfile.userCbu,
			alias: userProfile.userAlias,
			specialDiet: checkSpecialDiet(),
			alternativeEmail: userProfile.alternativeEmail,
			notifications: {
				eventStart: userProfile.notifications.eventStart, //revisar estas ultimas cuatro propiedades
				newEvent: userProfile.notifications.newEvent,
				penalizationStart: userProfile.notifications.penalizationStart,
				penalizationOneWeek: userProfile.notifications.penalizationOneWeek
			}
		};

		editUser(user?.id, provisionalSendingUser)
			.then(res => {
				setAlert(`${lang.successMsg}!`, AlertTypes.SUCCESS);
				if (userProfile.userImage !== emptyFile && !checkForWrongFileType(userProfile?.userImage as File)) {
					setAlert(lang.errorTypeFile, AlertTypes.ERROR);
					return;
				}
				userProfile.userImage !== emptyFile &&
					editProfilePicture(user?.id, userProfile?.userImage)
						.then(res => {
							setAlert(`${lang.successMsg}!`, AlertTypes.SUCCESS);
						})
						.catch(e => setAlert(`${lang.failureMsg}`, AlertTypes.ERROR));
			})
			.catch(e => setAlert(`${lang.failureMsg}`, AlertTypes.ERROR))
			.finally(() => {
				setIsLoading(false);
			});
	}

	function chekingSpecialDiet(diet: any) {
		return currentUser?.specialDiet?.includes(diet) && diet.toString();
	}

	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		if (target.files?.length && target.files.length > 0) {
			if (!checkForWrongFileType(target.files[0])) {
				setAlert(lang.errorTypeFile, AlertTypes.ERROR);
				return;
			} else {
				setUser({ ...userProfile, userImage: target.files[0] });
			}
		}
	}

	function setProfileImage(file: File) {
		setUser(prev => ({ ...prev, userImage: file }));
	}

	useEffect(() => {
		setUser(initialUser);
		(currentUser.notifications.newEvent ||
			currentUser.notifications.eventStart ||
			currentUser.notifications.penalizationStart ||
			currentUser.notifications.penalizationOneWeek) &&
			setActivateNotifications(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	useEffect(() => {
		if (!user?.id) return;
		const abortController = new AbortController();

		getUserById(user.id).then(res => {
			setCurrentUser(res as IUserByIdResponse); //ojo esto, no son del mismo tipo
			if (res.profilePicture !== null) {
				getImage(res.profilePicture).then(res2 => {
					setCurrentUser(prev => ({ ...prev, image: res2 }));
				});
			}
		});

		return () => abortController.abort();
	}, [user?.id]);

	return (
		<div className={styles.userProfileContainer}>
			<form onSubmit={e => handleUpdateProfile(e)}>
				<h1 className={styles.profileTitle}>{lang.profileTitle}</h1>

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
							<section className={styles.editImgSection} onClick={() => inputRef.current?.click()} style={{ cursor: 'pointer' }}>
								<div className={styles.editLogo}></div>
								<p>{lang.editImg}</p>
							</section>

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

						<section className={styles.notificationsSection}>
							<h3>{lang.notificationsTitle}</h3>
							<label className={styles.profileLabel}>
								<input
									id="activateNotifications"
									type="checkbox"
									className={styles.checkbox}
									checked={activateNotifications}
									onChange={e => {
										activateNotifications &&
											setUser({
												...userProfile,
												notifications: {
													...userProfile.notifications,
													newEvent: false,
													eventStart: false,
													penalizationStart: false,
													penalizationOneWeek: false
												}
											});
										setActivateNotifications(e.target.checked);
									}}
								/>
								{lang.activateNotifications}
							</label>
							{activateNotifications && (
								<div className={styles.visibleNotificationSettings}>
									<label htmlFor="alternativeEmail" className={styles.cbuLabel}>
										{lang.alternativeEmail}
									</label>
									<input
										className={styles.input}
										id="alternativeEmail"
										type="text"
										value={userProfile.alternativeEmail}
										onChange={e => {
											setUser({ ...userProfile, alternativeEmail: e.target.value });
										}}
										onBlur={e => {
											const email = e.target.value;
											const isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
											if (email && !isValid) {
												setAlert(lang.invalidEmail, AlertTypes.ERROR);
											}
										}}
									/>
									<p className={styles.notificationDescription}>{lang.notificationDescription}</p>
									<label className={styles.alternativeEmail}>
										<input
											id="newEventNotification"
											type="checkbox"
											className={styles.checkbox}
											checked={userProfile.notifications.newEvent}
											onChange={e => {
												setUser({
													...userProfile,
													notifications: {
														...userProfile.notifications,
														newEvent: e.target.checked
													}
												});
											}}
										/>
										{lang.newEventNotification}
									</label>
									<label className={styles.profileLabel}>
										<input
											id="eventComingNotification"
											type="checkbox"
											className={styles.checkbox}
											checked={userProfile.notifications.eventStart}
											onChange={e => {
												setUser({
													...userProfile,
													notifications: {
														...userProfile.notifications,
														eventStart: e.target.checked
													}
												});
											}}
										/>
										{lang.eventComingNotification}
									</label>
									<label className={styles.profileLabel}>
										<input
											id="penalizationStartedNotification"
											type="checkbox"
											className={styles.checkbox}
											checked={userProfile.notifications.penalizationStart}
											onChange={e => {
												setUser({
													...userProfile,
													notifications: {
														...userProfile.notifications,
														penalizationStart: e.target.checked
													}
												});
											}}
										/>
										{lang.penalizationStartedNotification}
									</label>
									<label className={styles.profileLabel}>
										<input
											id="penalizationStartedNotification"
											type="checkbox"
											className={styles.checkbox}
											checked={userProfile.notifications.penalizationOneWeek}
											onChange={e => {
												setUser({
													...userProfile,
													notifications: {
														...userProfile.notifications,
														penalizationOneWeek: e.target.checked
													}
												});
											}}
										/>
										{lang.oneWeekDebtorNotification}
									</label>
								</div>
							)}
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
