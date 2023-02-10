// import { useGlobal } from '../../../stores/GlobalContext';
import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

export default function PrivateFormLayout(props: PropsWithChildren): JSX.Element {
	// const { isSomethingLoading } = useGlobal();

	return (
		<div className={styles.privateContainer}>
			<header className={styles.privateHeader}>
				<nav className={styles.navbar}>
					<div className={styles.welcomeMsg}>Bienvenido: Gabriel</div>
					<div className={styles.logoutBtnSection}>
						<button className={styles.logoutBtn}>LOGOUT</button>
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
