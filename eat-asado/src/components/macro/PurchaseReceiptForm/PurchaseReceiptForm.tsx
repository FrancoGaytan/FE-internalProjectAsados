import { useState, useRef } from 'react';
import { className } from '../../../utils/className';
import { EventResponse } from '../../../models/event';
import { IPurchaseReceiptRequest } from '../../../models/purchases';
import Button from '../../micro/Button/Button';
import DragAndDrop from '../../micro/DragAndDrop/DragAndDrop';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useAlert } from '../../../stores/AlertContext';
import { createPurchaseReceipt, uploadPurchaseFile } from '../../../service/purchaseReceipts';
import styles from './styles.module.scss';

interface PurchaseReceiptProps {
	event: EventResponse;
	openModal: () => void;
	closeModal: () => void;
}

const initialPurchaseForm: IPurchaseReceiptRequest = {
	amount: 0,
	file: undefined,
	description: ''
};

export default function PurchaseReceiptForm(props: PurchaseReceiptProps) {
	const { event, openModal } = props;
	const lang = useTranslation('event');
	const { setAlert } = useAlert();
	const inputRef = useRef<HTMLInputElement>(null);
	const [purchaseForm, setPurchaseForm] = useState<IPurchaseReceiptRequest>(initialPurchaseForm);

	function checkForInputsToBeCompleted(): boolean {
		return purchaseForm.amount !== 0 && purchaseForm.description !== '' && purchaseForm.file !== undefined;
	}

	function setVoucherInput(file: File) {
		setPurchaseForm(prev => ({ ...prev, file: file }));
	}

	function discardPurchaseWithoutFiles(): boolean {
		//aca me esta faltando validar que pasa si selecciono transferencia y no lo estoy cargando
		return purchaseForm.file;
	}

	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		if (target.files?.length && target.files.length > 0) {
			setPurchaseForm({ ...purchaseForm, file: target.files[0] });
		}
	}

	async function confirmNewPurchase(e: any) {
		e.preventDefault();
		if (discardPurchaseWithoutFiles()) {
			if (checkForInputsToBeCompleted()) {
				const data = new FormData();
				data.append('file', purchaseForm.file as File);

				try {
					const resp = await createPurchaseReceipt(event?._id, { ...purchaseForm });
					setAlert(lang.purchaseReceiptLoaded, AlertTypes.SUCCESS);


					try {
						await uploadPurchaseFile(purchaseForm.file, resp._id);
						setAlert(`${lang.purchaseReceiptLoaded}!`, AlertTypes.SUCCESS);
					} catch (e) {
						setAlert(lang.fileSendingError, AlertTypes.ERROR);
					}

					setTimeout(() => window.location.reload(), 1000);

				} catch (e) {
					/* TODO: Acá hay un alert en inglés y en el otro hay uno en español
				Deberían estar en el mismo idioma y localizados */
					setAlert(lang.loadingPurchaseError, AlertTypes.ERROR);
				}
			}
		} else {
			setAlert(lang.uploadReceiptFirst, AlertTypes.ERROR);
		}
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
							{purchaseForm?.file ? <p>{purchaseForm.file.name}</p> : <p>{lang.uploadPurchaseReceipt}</p>}
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
}
