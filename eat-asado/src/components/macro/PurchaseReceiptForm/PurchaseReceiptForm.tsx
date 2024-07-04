import styles from './styles.module.scss';
import { className } from '../../../utils/className';
import { EventResponse } from '../../../models/event';
import { IUser } from '../../../models/user';
import { IPurchaseReceiptRequest, IPurchaseReceipt } from '../../../models/purchases';
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
		return purchaseForm.amount !== 0 && purchaseForm.description !== '' && purchaseForm.file !== undefined;
	}

	async function confirmNewPurchase(e: any) {
		e.preventDefault();
		console.log(checkForInputsToBeCompleted());
		if (checkForInputsToBeCompleted()) {
			const data = new FormData();
			data.append('file', purchaseForm.file as File);
			try {
				const resp = await createPurchaseReceipt(event?._id, { ...purchaseForm });
				setAlert(`Purchase Receipt loaded!`, AlertTypes.SUCCESS);
				try {
					await uploadPurchaseFile(purchaseForm.file, resp._id);
					setAlert(`${lang.transferReceiptLoaded}!`, AlertTypes.SUCCESS);
				} catch (e) {
					setAlert(`Error en el envío del archivo`, AlertTypes.ERROR);
				}
				setTimeout(() => window.location.reload(), 1000);
			} catch (e) {
				setAlert(`There's been a failure loading the purchase receipt`, AlertTypes.ERROR);
			}
		}
	}
	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		if (target.files?.length && target.files.length > 0) {
			setPurchaseForm({ ...purchaseForm, file: target.files[0] });
		}
	}

	function setVoucherInput(file: File) {
		setPurchaseForm(prev => ({ ...prev, file: file }));
	}

	return (
		<div {...className(styles.paycheck)}>
			<h4>{lang.payTitle}</h4>
			<div className={styles.paycheckContent}>
				<form onSubmit={e => confirmNewPurchase(e)} className={styles.purchaseForm}>
					<div className={styles.descInput}>
						<label className={styles.descLabel}>{lang.description}</label>
						<input
							type="text"
							className={styles.inputs}
							name="descriptionInput"
							value={purchaseForm.description}
							onChange={e => {
								setPurchaseForm({ ...purchaseForm, description: e.target.value });
							}}
						/>
					</div>
					<div className={styles.descInput}>
						<label className={styles.descLabel}>{lang.amountLabel}</label>
						<input
							type="text"
							className={styles.inputs}
							name="amountInput"
							value={purchaseForm.amount}
							onChange={e => {
								setPurchaseForm({ ...purchaseForm, amount: Number(e.target.value) });
							}}
						/>
					</div>

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
						<Button className={styles.confirmPayBtn} kind="primary" size="large" onClick={e => confirmNewPurchase(e)}>
							{lang.confirmPayBtn}
						</Button>
					</section>
				</form>
			</div>
		</div>
	);
};
export default PurchaseReceiptForm;
