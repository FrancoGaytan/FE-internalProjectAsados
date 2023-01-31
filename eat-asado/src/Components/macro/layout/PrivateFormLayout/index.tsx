// import { useGlobal } from '../../../stores/GlobalContext';
import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

export default function PrivateFormLayout(props: PropsWithChildren): JSX.Element {
	// const { isSomethingLoading } = useGlobal();

	return (
		<div>
			<section className={styles.privateHeader}>
				<nav className={styles.navbar}>
					<div className={styles.welcomeMsg}>Bienvenido: Gabriel</div>
					<div className={styles.logoutBtnSection}>
						<button className={styles.logoutBtn}>LOGOUT</button>
					</div>
				</nav>
			</section>
			<section className={styles.secondHeader}>
				<div className={styles.logo}></div>
				<div className={styles.fire}></div>
			</section>
			<section>
				<div className={styles.containerLayout}>{props.children}</div>
			</section>
			<div className={styles.footerFire}></div>
		</div>
	);
}
