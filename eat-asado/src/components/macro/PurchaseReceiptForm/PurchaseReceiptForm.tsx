import styles from './styles.module.scss';
import { className } from '../../../utils/className';
import { EventResponse } from '../../../models/event';
import { IUser } from '../../../models/user';
import { IPurchaseReceiptRequest, purchaseReceipt } from '../../../models/purchases';
import Button from '../../micro/Button/Button';
import { useState, useEffect, useRef } from 'react';
import DragAndDrop from '../../micro/DragAndDrop/DragAndDrop';
import { createTransferReceipt, uploadFile } from '../../../service';
import { useAuth } from '../../../stores/AuthContext';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useAlert } from '../../../stores/AlertContext';
import { PaymentOptsEnum } from '../../../enums/PaymentsMethods.enum';
import { createPurchaseReceipt, uploadPurchaseFile } from '../../../service/purchaseReceipts';

interface PurchaseReceiptProps {
	event: EventResponse;
	openModal: any;
	closeModal: () => void;
}

const PurchaseReceiptForm = (props: PurchaseReceiptProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { user } = useAuth();
	const lang = useTranslation('event');
	const { setAlert } = useAlert();
	const { event, openModal } = props;

	const initialPurchaseForm: IPurchaseReceiptRequest = {
		amount: 0,
		file: undefined,
		description: ''
	};

	const [purchaseForm, setPurchaseForm] = useState<IPurchaseReceiptRequest>(initialPurchaseForm);

	function checkForInputsToBeCompleted(): boolean {
		return true;
	}

	async function confirmPay(e: any) {
		e.preventDefault();
		if (checkForInputsToBeCompleted()) {
			const data = new FormData();
			data.append('file', purchaseForm.file as File);
			try {
				const resp = await createPurchaseReceipt(event?._id, { ...purchaseForm });
				setAlert(`Purchase Receipt loaded!`, AlertTypes.SUCCESS);

				try {
					await uploadPurchaseFile(purchaseForm.file, resp._id, event?._id);
					setAlert(`Purchase Receipt loaded!`, AlertTypes.SUCCESS);
				} catch (e) {
					setAlert(`Error en el envío del archivo`, AlertTypes.ERROR);
				}
			} catch (e) {
				setAlert(`${lang.transferReceiptFailure}`, AlertTypes.ERROR);
			}
		}
	}
	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		if (target.files?.length && target.files.length > 0) {
			setPurchaseForm({ ...purchaseForm, file: target.files[0] });
		}
	};

	const setVoucherInput = (file: File) => {
		setPurchaseForm(prev => ({ ...prev, file: file }));
	};

	return (
		<div {...className(styles.paycheck)}>
			<h4>{lang.payTitle}</h4>
			<div className={styles.paycheckContent}>
				<h5>
					{lang.cbu}
					{event?.shoppingDesignee?.cbu}
				</h5>

				<form onSubmit={e => confirmPay(e)} className={styles.purchaseForm}>
					<h4>Pago</h4>

					<DragAndDrop setState={setVoucherInput}>
						<div className={styles.inputFile}>
							<button
								className={styles.uploadBtn}
								onClick={e => {
									e.preventDefault();
									openModal();
									inputRef.current?.click();
								}}
								style={{ cursor: 'pointer' }}></button>
							{purchaseForm?.file ? <p>{purchaseForm.file.name}</p> : <p>{lang.uploadTransferReceipt}</p>}
						</div>
					</DragAndDrop>
					<input type="file" style={{ display: 'none' }} onChange={handleFile} ref={inputRef} />
					<section className={styles.btnSection}>
						<Button className={styles.confirmPayBtn} kind="primary" size="large" onClick={e => confirmPay(e)}>
							{lang.confirmPayBtn}
						</Button>
					</section>
				</form>
			</div>
		</div>
	);
};
export default PurchaseReceiptForm;
