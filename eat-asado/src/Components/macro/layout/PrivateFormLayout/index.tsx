// import { useGlobal } from '../../../stores/GlobalContext';
import React, { PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../../stores/LocalizationContext';
import styles from './styles.module.scss';

export default function PrivateFormLayout(props: PropsWithChildren): JSX.Element {
	// const { isSomethingLoading } = useGlobal();
	const lang = useTranslation('userProfile');

	const [user, setUser] = useState(localStorage.getItem("user"));
	const navigate = useNavigate();

	const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		localStorage.removeItem("user");
		navigate("/");
	}

	return (
		<div className={styles.privateContainer}>
			<header className={styles.privateHeader}>
				<nav className={styles.navbar}>
					<div className={styles.welcomeMsg}>{lang.headerWelcome} {user}</div>
					<div className={styles.logoutBtnSection}>
						<button className={styles.logoutBtn} onClick={handleLogout}>{lang.logoutBtn}</button>
					</div>
				</nav>
			</header>
			<section className={styles.secondHeader}>
				<div className={styles.logo}></div>
				<div className={styles.fire}></div>
			</section>
			<section className={styles.containerLayout}>{props.children}</section>
			<footer className={styles.footerFire}>
				<img src="/assets/pictures/fire.png" alt="" />
			</footer>
		</div>
	);
}
