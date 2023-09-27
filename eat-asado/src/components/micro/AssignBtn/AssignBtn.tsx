import { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';
import { className } from '../../../utils/className';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	kind: 'assign' | 'unAssign';
}

const AssignBtn = (props: PropsWithChildren<IButtonProps>): JSX.Element => {
	return (
		<div className={styles.assignContainer}>
			<button
				onClick={props.onClick}
				{...className(styles.button, styles[props.kind ?? 'assign'], styles[props.kind ?? 'unAssign'])}
				style={{ ...props.style }}
				id={props.id}></button>
			<h5 {...className(styles.btnText, styles[props.kind ?? 'assign'], styles[props.kind ?? 'unAssign'])} style={{ ...props.style }}>
				{props.kind === 'assign' ? 'Assign' : 'Un-Assign'}
			</h5>
		</div>
	);
};

export default AssignBtn;
