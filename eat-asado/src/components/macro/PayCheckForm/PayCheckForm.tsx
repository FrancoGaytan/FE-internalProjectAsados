import { className } from '../../../utils/className';
import { EventResponse } from '../../../models/event';
import { IUser } from '../../../models/user';
import { ITransferReceiptRequest } from '../../../models/transfer';
import { IPurchaseReceipt } from '../../../models/purchases';
import Button from '../../micro/Button/Button';
import { useState, useEffect, useRef } from 'react';
import DragAndDrop from '../../micro/DragAndDrop/DragAndDrop';
import { createTransferReceipt, uploadFile } from '../../../service';
import { useAuth } from '../../../stores/AuthContext';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useAlert } from '../../../stores/AlertContext';
import { PaymentOptsEnum } from '../../../enums/PaymentsMethods.enum';
import styles from './styles.module.scss';

interface PayCheckProps {
	event: EventResponse;
	shoppingDesignee: IUser;
	openModal: () => void;
	closeModal: () => void;
}

type PaymentOpts = PaymentOptsEnum.CASH | PaymentOptsEnum.TRANSFER;

export default function PayCheckForm(props: PayCheckProps) {
	const [priceToPay, setPriceToPay] = useState(0);
	const [payOpt, setPayOpt] = useState<PaymentOpts>(PaymentOptsEnum.TRANSFER);
	const [paymentDesc, setPaymentDesc] = useState<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const { user } = useAuth();
	const lang = useTranslation('event');
	const { setAlert } = useAlert();
	const { event, openModal } = props;

	const initialPayForm: ITransferReceiptRequest = {
		paymentMethod: 'transfer',
		amount: gettingPriceToPay(),
		file: undefined,
		description: '',
		user: user ? user.id : ''
	};

	const [payForm, setPayForm] = useState<ITransferReceiptRequest>(initialPayForm);

	function gettingPriceToPay(): number {
		let price = 0;

		if (!event) {
			return price;
		}

		event?.purchaseReceipts?.forEach((tr: IPurchaseReceipt) => {
			price = price + tr.amount;
		});

		return Math.round(price / event.members.length);
	}

	function checkForReceiptAndTransfer() {
		return payOpt === 'transfer' && payForm.file;
	}

	function tooglePaymentOp(e: React.ChangeEvent<HTMLInputElement>) {
		setPayOpt(e.target.value as PaymentOpts);
	}

	function setVoucherInput(file: File) {
		setPayForm(prev => ({ ...prev, file: file }));
	}

	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		e.stopPropagation();

		const target = e.target;

		if (target.files?.length && target.files.length > 0) {
			setPayForm({ ...payForm, file: target.files[0] });
		}
	}

	async function handleConfirmPay(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();

		if (!checkForReceiptAndTransfer()) {
			const data = new FormData();
			data.append('file', payForm.file as File);

			try {
				const resp = await createTransferReceipt(event?._id, { ...payForm });
				setAlert(`${lang.transferReceiptLoaded}!`, AlertTypes.SUCCESS);

				try {
					await uploadFile(payForm.file, resp._id);
					setAlert(`${lang.transferReceiptLoaded}!`, AlertTypes.SUCCESS);
					//closeModal(); // Mejora: lograr que se cierre el popup una vez que se confirme el updateFile
					// Podrías agregar el closeModal() en un finally, para que se cierre el modal sin importar si la petición fue exitosa o no.
				} catch (e) {
					setAlert(`Error en el envío del archivo`, AlertTypes.ERROR);
				}
			} catch (e) {
				setAlert(`${lang.transferReceiptFailure}`, AlertTypes.ERROR);
			}
		}
	}

	useEffect(() => {
		setPriceToPay(gettingPriceToPay());

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event, payForm]);

	useEffect(() => {
		setPayForm(prev => ({ ...prev, paymentMethod: payOpt }));
	}, [payOpt]);

	useEffect(() => {
		setPayForm(prev => ({ ...prev, description: paymentDesc }));
	}, [paymentDesc]);

	useEffect(() => {
		setPayForm(prev => ({ ...prev, user: user?.id as string }));
	}, [user]);

	return (
		<div {...className(styles.paycheck)}>
			<h4>{lang.payTitle}</h4>

			<div className={styles.paycheckContent}>
				{/* TODO: Demasiados h5, no es semántico. */}
				<h5>
					{lang.shoppingDesignee} {event?.shoppingDesignee?.name}
				</h5>

				<h5>
					{lang.alias} {event?.shoppingDesignee?.alias}
				</h5>

				<h5>
					{lang.cbu}
					{event?.shoppingDesignee?.cbu}
				</h5>

				<h5>
					{lang.totalPrice}${priceToPay}
				</h5>

				<form onSubmit={e => handleConfirmPay(e)} className={styles.payForm}>
					<h4>{lang.payOptTitle}</h4>
					<input type="radio" name="cashOption" value="cash" checked={payOpt === 'cash'} onChange={tooglePaymentOp} />
					<label>{lang.cashRadioBtn}</label>

					<input type="radio" name="transferOption" value="transfer" checked={payOpt === 'transfer'} onChange={e => tooglePaymentOp(e)} />
					<label>{lang.transferRadioBtn}</label>

					<div className={styles.descInput}>
						<label className={styles.descLabel}>{lang.description}</label>

						<input type="text" name="descriptionInput" value={paymentDesc} onChange={e => setPaymentDesc(e.target.value)} />
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
							{payForm?.file ? <p>{payForm.file.name}</p> : <p>{lang.uploadTransferReceipt}</p>}
						</div>
					</DragAndDrop>

					<input type="file" style={{ display: 'none' }} onChange={handleFile} ref={inputRef} />

					<footer className={styles.btnSection}>
						<Button type="submit" className={styles.confirmPayBtn} kind="primary" size="large">
							{lang.confirmPayBtn}
						</Button>
					</footer>
				</form>
			</div>
		</div>
	);
}
