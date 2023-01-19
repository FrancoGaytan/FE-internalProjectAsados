import { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import { TSize } from '../../../types/size';
import styles from './styles.module.scss';
import { className } from '../../../utils/className';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	kind?: 'primary' | 'secondary' | 'tertiary';
	size?: TSize;
}

const Button = (props: PropsWithChildren<IButtonProps>): JSX.Element => {
	return (
		<button
			onClick={props.onClick}
			{...className(styles.button, styles[props.kind ?? 'primary'], props.className, styles[`size-${props.size ?? 'auto'}`])}
			style={{ ...props.style }}
			id={props.id}>
			{props.children}
		</button>
	);
};

export default Button;
