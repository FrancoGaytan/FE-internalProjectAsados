// import { useGlobal } from '../../../stores/GlobalContext';
import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface FormLayoutProps extends PropsWithChildren {
	onSubmit?: React.FormEventHandler<HTMLFormElement>
}

export default function FormLayout(props: FormLayoutProps): JSX.Element {
	// const { isSomethingLoading } = useGlobal();

	return (
		<div className={styles.formLayout}>
			<form onSubmit={props.onSubmit}>
				<div className={styles.containerLayout}>{props.children}</div>
			</form>
		</div>
	);
}
