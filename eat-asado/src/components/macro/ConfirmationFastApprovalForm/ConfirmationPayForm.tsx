import styles from './styles.module.scss';
import { className } from '../../../utils/className';
import Button from '../../micro/Button/Button';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useAlert } from '../../../stores/AlertContext';
import { approvePaymentWithoutReceipt } from '../../../service';
interface ConfirmationPayProps {
	eventId: string;
	userId: string;
	closeModal: () => void;
}

function ConfirmationFastApprovalForm(props: ConfirmationPayProps) {
	const lang = useTranslation('event');
	const { setAlert } = useAlert();
	const { eventId, userId } = props;

	async function approvePayment(): Promise<void> {
		const abortController = new AbortController();
		try {
			await approvePaymentWithoutReceipt(userId, eventId, abortController.signal);
			setAlert(lang.payApprovedSuccessfully, AlertTypes.SUCCESS);
			setTimeout(() => window.location.reload(), 1000); //TODO: mejora propuesta, sacar todos estos reloads con los timaouts y utilizar un refetch y usar la funcion closemodal
		} catch (error) {
			setAlert(lang.payApproveFailed, AlertTypes.ERROR);
		}
	}

	return (
		<div {...className(styles.paycheck)}>
			<p className={styles.popupTitle}>{lang.fastAproveText}</p>
			<div className={styles.paycheckContent}>
				<section className={styles.btnSection}>
					<Button className={styles.confirmPayBtn} kind="whitePrimary" size="short" onClick={e => approvePayment()}>
						{lang.confirmPayBtn}
					</Button>
				</section>
			</div>
		</div>
	);
}

export default ConfirmationFastApprovalForm;
