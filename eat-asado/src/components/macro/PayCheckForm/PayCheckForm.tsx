import styles from './styles.module.scss';
import { className } from '../../../utils/className';
import { EventResponse } from '../../../models/event';
import { IUser } from '../../../models/user';
import { ITransferReceiptRequest, purchaseReceipt } from '../../../models/transfer';
import Button from '../../micro/Button/Button';
import { useState, useEffect, useRef } from 'react';
import DragAndDrop from '../../micro/DragAndDrop/DragAndDrop';
import { createTransferReceipt, uploadFile } from '../../../service';
import { useAuth } from '../../../stores/AuthContext';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useAlert } from '../../../stores/AlertContext';
import { PaymentOptsEnum } from '../../../enums/PaymentsMethods.enum';

interface PayCheckProps {
	event: EventResponse;
	shoppingDesignee: IUser;
	openModal: any;
	closeModal: () => void;
}

const PayCheckForm = (props: PayCheckProps) => {
	const [priceToPay, setPriceToPay] = useState(0);
	const [payOpt, setPayOpt] = useState<PaymentOptsEnum>(PaymentOptsEnum.TRANSFER);
	const [paymentDesc, setPaymentDesc] = useState<string>('');
	const inputRef = useRef<HTMLInputElement>(null);
	const { user } = useAuth();
	const lang = useTranslation('event');
	const { setAlert } = useAlert();
	const { event, /* shoppingDesignee ,*/ openModal /* closeModal */ } = props;

	const initialPayForm: ITransferReceiptRequest = {
		paymentMethod: 'transfer',
		amount: gettingPriceToPay(),
		file: undefined,
		description: '',
		user: user?.id as string
	};

	const [payForm, setPayForm] = useState<ITransferReceiptRequest>(initialPayForm);

	function gettingPriceToPay(): number {
		let price = 0;
		event?.purchaseReceipts?.forEach((tr: purchaseReceipt) => {
			price = price + tr.amount;
		});
		return price;
	}

	function checkForReceiptAndTransfer() {
		return payOpt === 'transfer' && !payForm?.file;
	}

	async function confirmPay(e: any) {
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
				} catch (e) {
					setAlert(`Error en el envío del archivo`, AlertTypes.ERROR);
				}
			} catch (e) {
				setAlert(`${lang.transferReceiptFailure}`, AlertTypes.ERROR);
			}
		}
	}

	function tooglePaymentOp(e: any) {
		setPayOpt(e.target.value);
	}

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const target = e.target;

		if (target.files?.length && target.files.length > 0) {
			setPayForm({ ...payForm, file: target.files[0] });
		}
	};

	const setVoucherInput = (file: File) => {
		setPayForm(prev => ({ ...prev, file: file }));
	};

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

				<form onSubmit={e => confirmPay(e)} className={styles.payForm}>
					<h4>{lang.payOptTitle}</h4>
					<input type="radio" name="cashOption" value="cash" checked={payOpt === 'cash' ? true : false} onChange={tooglePaymentOp} />
					{lang.cashRadioBtn}
					<input
						type="radio"
						name="transferOption"
						value="transfer"
						checked={payOpt === 'transfer' ? true : false}
						onChange={tooglePaymentOp}
					/>{' '}
					{lang.transferRadioBtn}
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
export default PayCheckForm;
