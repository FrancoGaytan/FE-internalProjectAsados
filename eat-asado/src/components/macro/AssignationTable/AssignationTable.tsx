import styles from './styles.module.scss';
import Button from '../../micro/Button/Button';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useAlert } from '../../../stores/AlertContext';
import { useEffect, useState } from 'react';
import { getPurchaseReceiptsByEvent } from '../../../service/purchaseReceipts';
import { assignMembersToReceipt } from '../../../service/purchaseReceipts';
import { IUser } from '../../../models/user';

interface ConfirmationPayProps {
	eventId: string;
	userId: string;
	closeModal: () => void;
}

export interface IParticipant {
	_id: string;
	name: string;
	lastName?: string;
}

export interface IPurchaseAssignment {
	_id: string;
	image: string;
	description: string;
	amount: number;
	participants: IParticipant[];
	event: string;
	shoppingDesignee: IUser;
}

function AssignationTable(props: ConfirmationPayProps) {
	const lang = useTranslation('event');
	const { setAlert } = useAlert();
	const { eventId } = props;
	const [eventReceipts, setEventReceipts] = useState<IPurchaseAssignment[]>([]);
	const [allUsers, setAllUsers] = useState<IParticipant[]>([]);

	function isEditable(targetUserId: string): boolean {
		const userIsShoppingDesignee = eventReceipts.some(receipt => receipt.shoppingDesignee._id === props.userId);
		return userIsShoppingDesignee || targetUserId === props.userId;
	}

	function handleConfirm() {
		const controller = new AbortController();

		const payload = {
			receipts: eventReceipts.map(receipt => ({
				id: receipt._id,
				participants: receipt.participants.map(p => p._id)
			}))
		};

		assignMembersToReceipt(payload, controller.signal)
			.then(() => {
				setAlert(lang.assignationsUpdatedSuccessfully, AlertTypes.SUCCESS);
				props.closeModal();
			})
			.catch(() => {
				setAlert(lang.errorUpdatingAssignations, AlertTypes.ERROR);
			});
	}

	useEffect(() => {
		getPurchaseReceiptsByEvent(eventId)
			.then(res => {
				setEventReceipts(res);

				const userMap = new Map<string, IParticipant>();
				res.forEach(receipt => {
					receipt.participants.forEach(user => {
						if (!userMap.has(user._id)) {
							userMap.set(user._id, user);
						}
					});
				});

				setAllUsers(Array.from(userMap.values()));
			})
			.catch(e => {
				console.error('Error getting receipts:', e);
			});
	}, [props, eventId]);

	return (
		<div className={styles.assignationTableWrapper}>
			<div className={styles.modalTitle}>{lang.purchasesMadeTitle}</div>
			<div className={styles.assignationTableContent}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>{lang.user}</th>
							{eventReceipts.map(receipt => (
								<th key={receipt._id}>{receipt.description}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{allUsers.map(user => (
							<tr key={user._id}>
								<td className={styles.namesColumn}>{`${user.name} ${user.lastName?.charAt(0)}`}</td>
								{eventReceipts.map(receipt => (
									<td key={receipt._id}>
										<input
											type="checkbox"
											checked={receipt.participants.some(p => p._id === user._id)}
											onChange={() => {
												if (!isEditable(user._id)) return;

												const updatedReceipts = [...eventReceipts];
												const targetReceipt = updatedReceipts.find(r => r._id === receipt._id);
												if (!targetReceipt) return;

												const isAlreadyIncluded = targetReceipt.participants.some(p => p._id === user._id);

												if (isAlreadyIncluded) {
													targetReceipt.participants = targetReceipt.participants.filter(p => p._id !== user._id);
												} else {
													targetReceipt.participants.push({ _id: user._id, name: user.name });
												}

												setEventReceipts(updatedReceipts);
											}}
											disabled={!isEditable(user._id)}
											className={isEditable(user._id) ? styles.editableCheckbox : ''}
										/>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className={styles.confirmButtonContainer}>
				<Button kind="primary" size="large" onClick={handleConfirm}>
					{lang.confirmChangeBtn}
				</Button>
			</div>
		</div>
	);
}

export default AssignationTable;
