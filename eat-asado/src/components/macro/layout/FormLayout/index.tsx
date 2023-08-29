// import { useGlobal } from '../../../stores/GlobalContext';
import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface FormLayoutProps {
	onSubmit?: (e: any) => void;
}

export default function FormLayout(props: PropsWithChildren<FormLayoutProps>): JSX.Element {
	// const { isSomethingLoading } = useGlobal();

	return (
		<div className={styles.formLayout}>
			<form onSubmit={props.onSubmit}>
				<div className={styles.containerLayout}>{props.children}</div>
			</form>
		</div>
	);
}
