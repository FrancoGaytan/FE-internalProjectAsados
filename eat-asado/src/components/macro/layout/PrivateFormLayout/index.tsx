import { PropsWithChildren } from 'react';
import { useTranslation } from '../../../../stores/LocalizationContext';
import AlertPopup from '../../../micro/AlertPopup/AlertPopup';
import styles from './styles.module.scss';
import { useAuth } from '../../../../stores/AuthContext';

export default function PrivateFormLayout(props: PropsWithChildren): JSX.Element {
	const lang = useTranslation('userProfile');

	const { user, logout } = useAuth();

	const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		logout();
	};

	return (
		<div className={styles.privateContainer}>
			<AlertPopup />
			<header className={styles.privateHeader}>
				<nav className={styles.navbar}>
					{!!user?.name && (
						<div className={styles.welcomeMsg}>
							{lang.headerWelcome} {user.name}
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
				<div className={styles.logo}></div>
				<div className={styles.fire}></div>
			</section>
			<section className={styles.containerLayout}>{props.children}</section>
			<footer className={styles.footerFire}>{/* <img src="/assets/pictures/fire.png" alt="" /> */}</footer>
		</div>
	);
}
