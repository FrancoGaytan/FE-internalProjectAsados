import { useGlobal } from '../../../stores/GlobalContext';
import { PropsWithChildren } from 'react';

export default function Layout(props: PropsWithChildren): JSX.Element {
	const { isSomethingLoading } = useGlobal();

	return (
		<div>
			<main>{props.children}</main>
		</div>
	);
}
