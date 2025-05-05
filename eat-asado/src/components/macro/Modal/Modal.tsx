import styles from './styles.module.scss';
import { className } from '../../../utils/className';
import { JSX } from 'react';

interface ModalProps {
	children: JSX.Element;
	isOpen: boolean;
	closeModal: () => void;
}

export default function Modal({ children, isOpen, closeModal }: ModalProps) {
	return (
		<article {...className(styles.modal, styles[isOpen ? 'isOpen' : ''])}>
			<div className={styles.modalContainer}>
				<button className={styles.closeModalBtn} onClick={closeModal}>
					X
				</button>

				{children}
			</div>
		</article>
	);
}
