import styles from './styles.module.scss';
import { className } from '../../../utils/className';
import { EventResponse } from '../../../models/event';
import Button from '../../micro/Button/Button';
import { downloadFile } from '../../../utils/utilities';
import { approveTransferReceipts, deleteTransferReceipt } from '../../../service';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useAlert } from '../../../stores/AlertContext';
import { getImage } from '../../../service/purchaseReceipts';
import { getTransferReceipt } from '../../../service';
import { useEffect, useState } from 'react';
import { transferReceipt } from '../../../models/transfer';
import { IPurchaseReceipt } from '../../../models/purchases';
import { FilePreview } from '../../../pages';
import FilesPreview from '../FilesPreview/FilesPreview';

interface ConfirmationPayProps {
	event: EventResponse;
	openModal: () => void;
	transferReceiptId?: string;
	closeModal: () => void;
}

function ConfirmationPayForm(props: ConfirmationPayProps) {
	const lang = useTranslation('event');
	const { setAlert } = useAlert();
	const { event, transferReceiptId } = props;
	const [transferReceipt, setTransferReceipt] = useState<transferReceipt>();
	const [openFilePreview, setOpenFilePreview] = useState<boolean>(false);
	const [filePreview, setFilePreview] = useState<FilePreview | null>(null);

	async function downloadTransfer(transferId: string) {
		try {
			const transferImage = await getImage(transferReceipt?.image);
			downloadFile({ file: transferImage, fileName: transferId });
		} catch (e) {
			setAlert('error', AlertTypes.ERROR);
		}
	}

	async function confirmPayment(receiptId: string | undefined): Promise<void> {
		const abortController = new AbortController();
		try {
			await approveTransferReceipts(receiptId, event._id, abortController.signal);
			setAlert(lang.payApprovedSuccessfully, AlertTypes.SUCCESS);
			props.closeModal();
		} catch (error) {
			setAlert(lang.payApproveFailed, AlertTypes.ERROR);
		}
	}

	async function rejectPayment(receiptId: string | undefined): Promise<void> {
		try {
			await deleteTransferReceipt(receiptId);
			setAlert(lang.payRejectedSuccessfully, AlertTypes.SUCCESS);
			props.closeModal();
		} catch (error) {
			setAlert(lang.payRejectionFailed, AlertTypes.ERROR);
		}
	}

	function gettingDateDiference(): number {
		const startingDate = new Date(event.penalizationStartDate);
		const todayDate = new Date();

		const start = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate());
		const today = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

		if (today <= start) return 0;

		const diffInMilliseconds = today.getTime() - start.getTime();
		return diffInMilliseconds / (1000 * 60 * 60 * 24);
	}

	function closeFilePreview(): void {
		setOpenFilePreview(false);
		setFilePreview(null);
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
			if (new Date(transferReceipt?.datetime as Date) < new Date()) {
				currentPenalization = event.penalization * Math.floor(gettingDateDiference());
			}
		}

		return Math.round(price / event.members.length + currentPenalization);
	}

	async function PreviewTransfer(transfer: transferReceipt) {
		setOpenFilePreview(true);
		try {
			const transferImage = await getImage(transfer.image);
			const objectURL = URL.createObjectURL(transferImage);
			setFilePreview({
				uri: objectURL,
				fileType: transferImage.type.split('/')[1],
				fileName: 'File Preview'
			});

			setTimeout(() => {
				setOpenFilePreview(true);
			}, 1000);
		} catch (e) {
			console.log(e);
		}
	}

	useEffect(() => {
		if (!transferReceiptId) {
			return;
		}
		getTransferReceipt(transferReceiptId)
			.then(res => {
				setTransferReceipt(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});
	}, [transferReceiptId]);

	return (
		<div {...className(styles.paycheck)}>
			<p className={styles.popupTitle}>{lang.validatePaymentTitle}</p>
			<div className={styles.paycheckContent}>
				<div className={styles.priceSection}>
					{lang.amountToBePaid}
					{gettingPriceToPay()}
				</div>
				<section className={styles.downloadContent}>
					{transferReceipt?.paymentMethod === 'cash' ? (
						<p className={styles.downloadText}>{lang.paidByCashText}</p>
					) : (
						<div className={styles.downloadTransferArea}>
							<button
								className={styles.previewBtn}
								onClick={e => {
									e.preventDefault();
									PreviewTransfer(transferReceipt as transferReceipt);
								}}
								style={{ cursor: 'pointer' }}></button>
							<p className={styles.downloadText}>{lang.previewText}</p>
						</div>
					)}
				</section>

				<section className={styles.btnSection}>
					<Button className={styles.confirmPayBtn} kind="whitePrimary" size="short" onClick={e => confirmPayment(transferReceiptId)}>
						{lang.confirmPayBtn}
					</Button>
					<Button className={styles.rejectPayBtn} kind="whiteSecondary" size="short" onClick={e => rejectPayment(transferReceiptId)}>
						{lang.rejectPayBtn}
					</Button>
				</section>

				{filePreview && filePreview.fileType && filePreview.fileName && (
					<FilesPreview
						doc={[
							{
								uri: filePreview.uri,
								fileType: filePreview.fileType,
								fileName: filePreview.fileName
							}
						]}
						state={openFilePreview}
						onClose={closeFilePreview}
					/>
				)}
			</div>
		</div>
	);
}

export default ConfirmationPayForm;
