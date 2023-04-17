// import { useGlobal } from '../../../stores/GlobalContext';
import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

export default function FormLayout(props: PropsWithChildren): JSX.Element {
	// const { isSomethingLoading } = useGlobal();

	return (
		<div className={styles.formLayout}>
			<section>
				<div className={styles.containerLayout}>{props.children}</div>
			</section>
		</div>
	);
}
