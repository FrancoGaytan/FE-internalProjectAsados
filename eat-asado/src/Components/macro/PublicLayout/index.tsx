import { useGlobal } from '../../../stores/GlobalContext';
import { PropsWithChildren } from 'react';
import styles from "./styles.module.scss";

export default function PublicLayout(props: PropsWithChildren): JSX.Element {
	// const { isSomethingLoading } = useGlobal();

	return (
		<div className={styles.publicLayout}>
			<section className={styles.container}>
			<div className={styles.closeBtn}></div>
				{props.children}
			</section>
		</div>
	);
}
