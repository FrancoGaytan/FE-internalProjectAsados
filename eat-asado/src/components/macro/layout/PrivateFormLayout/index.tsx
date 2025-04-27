import { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from '../../../../stores/LocalizationContext';
import AlertPopup from '../../../micro/AlertPopup/AlertPopup';
import { useAuth } from '../../../../stores/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { locales } from '../../../../localization';
import { getUserById } from '../../../../service';
import { IUser } from '../../../../models/user';
import { getImage } from '../../../../service/purchaseReceipts';
import FlagButton from './FlagButton';

export default function PrivateFormLayout(props: PropsWithChildren): JSX.Element {
	const lang = useTranslation('userProfile');
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [userData, setUserData] = useState<IUser | undefined>(undefined);
	const [image, setImage] = useState<File | undefined>(undefined);

	function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		logout();
	}
	function handleGoToProfile(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
		e.preventDefault();
		navigate('/userProfile');
	}
	function handleGoToMain(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		navigate('/');
	}

	useEffect(() => {
		if (user) {
			getUserById(user.id)
				.then(resp => {
					setUserData(resp);

					getImage(resp.profilePicture)
						.then(setImage)
						.catch(e => {
							console.error('Catch in context: ', e);
						});
				})
				.catch(e => {
					console.error('Catch in context:', e);

				});
		}
	}, [user]);

	return (
		<div className={styles.privateContainer}>
			<AlertPopup />
			<header className={styles.privateHeader}>
				<nav className={styles.navbar}>
					{!!user?.name && (
						<div className={styles.welcomeMsg}>
							{lang.headerWelcome} {user.name}
							{!!userData && userData.profilePicture !== undefined && image instanceof Blob ? (
								<img
									className={styles.profileBtn}
									src={URL.createObjectURL(image as File)}
									alt="selected"
									onClick={handleGoToProfile}
								/>
							) : (
								<img
									src="/assets/pictures/profile.png"
									className={styles.profileBtn}
									alt="placeholder"
									onClick={handleGoToProfile}
								/>
							)}
							<FlagButton className={styles.spanishFlag} locale={locales[1]} />
							<FlagButton className={styles.englishFlag} locale={locales[0]} /> 
						</div>
					)}

					<div className={styles.logoutBtnSection}>
						{!!user?.name ? (
							<button className={styles.logoutBtn} onClick={handleLogout}>
								{lang.logoutBtn}
							</button>
						) : (
							<button className={styles.logoutBtn} onClick={handleLogout}>
								{lang.loginBtn}
							</button>
						)}
					</div>
				</nav>
			</header>

			<section className={styles.secondHeader}>
				<button className={styles.logo} onClick={handleGoToMain}></button>

				<div className={styles.fire} />
			</section>

			<section className={styles.containerLayout}>{props.children}</section>

			<footer className={styles.footerFire} />
		</div>
	);
}