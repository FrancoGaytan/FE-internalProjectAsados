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

	function gettingDateDiference(): number {
		const startingDate = new Date(event.penalizationStartDate);
		const todayDate = new Date();
		console.log('starting date' + startingDate);
		console.log('today date' + todayDate);
		const diffInMilliseconds = Math.abs(startingDate.getTime() - todayDate.getTime());
		return diffInMilliseconds / (1000 * 60 * 60 * 24);
	}

	function gettingPriceToPay(): number {
		let price = 0;
		let currentPenalization = 0;

		if (!event) {
			return price;
		}

		event?.purchaseReceipts?.forEach((tr: IPurchaseReceipt) => {
			price = price + tr.amount;
		});

		if (event.penalization && gettingDateDiference() > 0) {
			console.log(gettingDateDiference());
			if (new Date(event.penalizationStartDate) < new Date()) {
				currentPenalization = event.penalization * Math.floor(gettingDateDiference());
			}
		}
		return Math.round(price / event.members.length + currentPenalization);
	}

	function checkForReceiptAndTransfer() {
		return payOpt === 'transfer' && payForm.file;
	}

	function discardTransferWithoutFiles(): boolean {
		//aca me esta faltando validar que pasa si selecciono transferencia y no lo estoy cargando
		return !(payOpt === 'transfer' && !payForm.file);
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

	function copyLinkEvent(data: string): void {
		navigator.clipboard.writeText(data);
		setAlert(lang.linkCopiedToClipboard, AlertTypes.SUCCESS);
	}

	async function confirmPay(e: any) {
		e.preventDefault();
		if (discardTransferWithoutFiles()) {
			if (checkForReceiptAndTransfer()) {
				const data = new FormData();
				data.append('file', payForm.file as File);
				try {
					const resp = await createTransferReceipt(event?._id, { ...payForm });
					setAlert(`${lang.transferReceiptLoaded}!`, AlertTypes.SUCCESS);

					try {
						await uploadFile(payForm.file, resp._id);
						setAlert(`${lang.transferReceiptLoaded}!`, AlertTypes.SUCCESS);
						setTimeout(() => window.location.reload(), 1000);
						//closeModal(); // Mejora: lograr que se cierre el popup una vez que se confirme el updateFile
					} catch (e) {
						setAlert(lang.errorSubmittingFile, AlertTypes.ERROR);
					}
				} catch (e) {
					setAlert(`${lang.transferReceiptFailure}`, AlertTypes.ERROR);
				}
			} else {
				await createTransferReceipt(event?._id, { ...payForm });
				setAlert(`${lang.transferReceiptLoaded}!`, AlertTypes.SUCCESS);
				setTimeout(() => window.location.reload(), 1000);
			}
		} else {
			setAlert(lang.uploadReceiptFirst, AlertTypes.ERROR);
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
				<h5 className={styles.paymentDataSD}>
					{lang.shoppingDesignee} {event?.shoppingDesignee?.name}
				</h5>

				<h5 className={styles.paymentData}>
					{lang.alias} {event?.shoppingDesignee?.alias}
					{event?.shoppingDesignee?.alias && (
						<button className={styles.copyBtn} onClick={() => copyLinkEvent(event?.shoppingDesignee?.alias as string)}></button>
					)}
				</h5>

				<h5 className={styles.paymentData}>
					{lang.cbu}
					{event?.shoppingDesignee?.cbu}
					{event?.shoppingDesignee?.cbu && (
						<button className={styles.copyBtn} onClick={() => copyLinkEvent(event?.shoppingDesignee?.cbu as string)}></button>
					)}
				</h5>

				<h5>
					{lang.totalPrice}${priceToPay}
				</h5>

				<form onSubmit={e => confirmPay(e)} className={styles.payForm}>
					<h4>{lang.payOptTitle}</h4>
					<input type="radio" name="cashOption" value="cash" checked={payOpt === 'cash'} onChange={tooglePaymentOp} />
					<label>{lang.cashRadioBtn}</label>

					<input type="radio" name="transferOption" value="transfer" checked={payOpt === 'transfer'} onChange={e => tooglePaymentOp(e)} />
					<label>{lang.transferRadioBtn}</label>

					<div className={styles.descInput}>
						<div>
							<label className={styles.descLabel}>{lang.description}</label>
							<label className={styles.optionalLabel}>{lang.optional}</label>
						</div>
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
						<Button type="submit" className={styles.confirmPayBtn} kind="primary" size="large" onClick={e => confirmPay(e)}>
							{lang.confirmPayBtn}
						</Button>
					</section>
				</form>
			</div>
		</div>
	);
}
