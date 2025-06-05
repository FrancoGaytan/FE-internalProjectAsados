import { JSX, PropsWithChildren } from 'react';
import styles from './styles.module.scss';

interface FormLayoutProps {
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormLayout(props: PropsWithChildren<FormLayoutProps>): JSX.Element {
	return (
		<div className={styles.formLayout}>
			<form onSubmit={e => props.onSubmit?.(e)}>
				<div className={styles.containerLayout}>{props.children}</div>
			</form>
		</div>
	);
}
