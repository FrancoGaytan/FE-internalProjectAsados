import styles from './styles.module.scss';
import { className } from '../../../utils/className';
import { EventResponse } from '../../../models/event';
import { IUser } from '../../../models/user';
import Button from '../../micro/Button/Button';
import { useState, useEffect, useRef } from 'react';
import { createTransferReceipt, uploadFile } from '../../../service';
import { useAuth } from '../../../stores/AuthContext';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useAlert } from '../../../stores/AlertContext';

interface ConfirmationPayProps {
	event: EventResponse;
	openModal: any;
	transferReceiptId: String;
	closeModal: () => void;
}

const ConfirmationPayForm = (props: ConfirmationPayProps) => {
	const { user } = useAuth();
	const lang = useTranslation('event');
	const { setAlert } = useAlert();
	const { event, /* shoppingDesignee ,*/ openModal /* closeModal */ } = props;

	function confirmPayment(): void {}

	function rejectPayment(): void {}

	return (
		<div {...className(styles.paycheck)}>
			<p className={styles.popupTitle}>{lang.validatePaymentTitle}</p>
			<div className={styles.paycheckContent}>
				<section className={styles.downloadContent}>
					<button
						className={styles.uploadBtn}
						onClick={e => {
							e.preventDefault();
							//la funcion para descargar el comprobante
						}}
						style={{ cursor: 'pointer' }}></button>
					<p className={styles.downloadText}>{lang.downloadText}</p>
					{/* localizar */}
				</section>

				<section className={styles.btnSection}>
					<Button className={styles.confirmPayBtn} kind="whitePrimary" size="short" onClick={e => confirmPayment()}>
						{lang.confirmPayBtn}
					</Button>
					<Button className={styles.rejectPayBtn} kind="whiteSecondary" size="short" onClick={e => rejectPayment()}>
						{lang.rejectPayBtn}
					</Button>
				</section>
			</div>
		</div>
	);
};

export default ConfirmationPayForm;
