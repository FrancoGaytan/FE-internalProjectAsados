import { JSX, PropsWithChildren } from 'react';
import AlertPopup from '../../micro/AlertPopup/AlertPopup';
// import styles from './styles.module.scss';

export default function PublicLayout(props: PropsWithChildren): JSX.Element {
	return (
		<div>
			<AlertPopup />

			<main>{props.children}</main>
		</div>
	);
}
