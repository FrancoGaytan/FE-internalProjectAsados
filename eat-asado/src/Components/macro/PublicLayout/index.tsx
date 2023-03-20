import { useGlobal } from '../../../stores/GlobalContext';
import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';
import AlertPopup from '../../micro/AlertPopup/AlertPopup';

export default function PublicLayout(props: PropsWithChildren): JSX.Element {
	// const { isSomethingLoading } = useGlobal();

	return (
		<div>
			<AlertPopup />
			<main>{props.children}</main>
		</div>
	);
}
