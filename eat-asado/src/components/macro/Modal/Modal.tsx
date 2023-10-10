import styles from './styles.module.scss';
import { className } from '../../../utils/className';

interface ModalProps {
	children?: any; // x ahora lo soluciono así, despues cambialo
	isOpen: boolean;
	closeModal: any;
}

const Modal = ({ children, isOpen, closeModal }: ModalProps) => {
	return (
		<article {...className(styles.modal, styles[isOpen ? 'isOpen' : ''])}>
			<div className={styles.modalContainer}>
				<button className={styles.closeModalBtn} onClick={closeModal()}>
					X
				</button>
				{children}
			</div>
		</article>
	);
};

export default Modal;
