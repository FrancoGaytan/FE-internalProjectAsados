import { PropsWithChildren } from 'react';
import { useLocalizationContext, useTranslation } from '../../../../stores/LocalizationContext';
import AlertPopup from '../../../micro/AlertPopup/AlertPopup';
import { useAuth } from '../../../../stores/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { locales } from '../../../../localization';

export default function PrivateFormLayout(props: PropsWithChildren): JSX.Element {
	const lang = useTranslation('userProfile');
	const navigate = useNavigate();
	const { setLocale } = useLocalizationContext();
	const { user, logout } = useAuth();

	function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		logout();
	}
	function handleGoToProfile(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		navigate('/userProfile');
	}
	function handleGoToMain(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		navigate('/');
	}

	return (
		<div className={styles.privateContainer}>
			<AlertPopup />
			<header className={styles.privateHeader}>
				<nav className={styles.navbar}>
					{!!user?.name && (
						<div className={styles.welcomeMsg}>
							{lang.headerWelcome} {user.name}
							<button className={styles.profileBtn} onClick={handleGoToProfile}></button>
							<button
								className={styles.spanishFlag}
								onClick={(e): void => {
									e.preventDefault();
									setLocale(locales[1]);
								}}></button>
							<button
								className={styles.englishFlag}
								onClick={(e): void => {
									e.preventDefault();
									setLocale(locales[0]);
								}}></button>
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

				<div className={styles.fire}></div>
			</section>

			<section className={styles.containerLayout}>{props.children}</section>

			<footer className={styles.footerFire}></footer>
		</div>
	);
}
