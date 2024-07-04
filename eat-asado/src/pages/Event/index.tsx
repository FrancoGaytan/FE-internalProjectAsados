import { useMemo, useState, useEffect } from 'react';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import { useEvent } from '../../stores/EventContext';
import { useAuth } from '../../stores/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getEventById, hasUploadedTransferReceipt, subscribeToAnEvent, unsubscribeToAnEvent } from '../../service';
import { useParams } from 'react-router-dom';
import { IUser } from '../../models/user';
import AssignBtn from '../../components/micro/AssignBtn/AssignBtn';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { getUserById, editRoles, deleteEvent, editEvent } from '../../service';
import Modal from '../../components/macro/Modal/Modal';
import PayCheckForm from '../../components/macro/PayCheckForm/PayCheckForm';
import { EventResponse, IEvent } from '../../models/event';
import PurchaseReceiptForm from '../../components/macro/PurchaseReceiptForm/PurchaseReceiptForm';
import { getPurchaseReceipts, deleteEventPurchase, getImage } from '../../service/purchaseReceipts';
import { IPurchaseReceipt } from '../../models/purchases';
import { downloadFile } from '../../utils/utilities';

export function Event(): JSX.Element {
	const lang = useTranslation('eventHome');
	const { user } = useAuth();
	const navigate = useNavigate();
	const { setAlert } = useAlert();
	const [event, setEvent] = useState<any>(); //TODO: Sacar o typear este any
	const [actualUser, setActualUser] = useState<IUser>();
	const userIdParams = useParams();
	const [modalState, setModalState] = useState(false);
	const [modalPurchaseRecipt, setModalPurchaseRecipt] = useState(false);
	const [userHasPaid, setUserHasPaid] = useState(false);
	const [purchasesMade, setPurchasesMade] = useState([]);

	function parseMinutes(minutes: string) {
		let newMinutes = minutes;
		if (Number(minutes) < 10) {
			newMinutes = '0' + minutes;
		}
		return newMinutes;
	}

	function getOnlyDate(evDateTime: Date) {
		return evDateTime.getDate().toString() + '. ' + evDateTime.getMonth().toString() + '. ' + evDateTime.getFullYear().toString() + '.';
	}

	function getOnlyHour(evDateTime: Date) {
		return evDateTime.getHours().toString() + ':' + parseMinutes(evDateTime.getMinutes().toString());
	}

	function isUserIntoEvent(): Boolean {
		const ev = event.members;
		return ev.find((member: { _id: string }) => member._id === user?.id);
	}

	function subscribeUserToEvent(): void {
		subscribeToAnEvent(user?.id as string, event?._id)
			.then(res => {
				setAlert(`${lang.userAddedSuccessfully}!`, AlertTypes.SUCCESS);
				setTimeout(() => window.location.reload(), 1000);
			})
			.catch(e => setAlert(`${lang.userAddingFailure}`, AlertTypes.ERROR));
	}

	function removeResponsabilitiesAtUnsubscribing(): void {
		event?.chef && event?.chef._id === user?.id && toogleChef();
		event?.shoppingDesignee && event?.shoppingDesignee._id === user?.id && toogleShopDesignee();
	}

	function unsubscribeUserToEvent(): void {
		unsubscribeToAnEvent(user?.id as string, event?._id)
			.then(res => {
				setAlert(`${lang.userRemovedSuccessfully}!`, AlertTypes.SUCCESS);
				setTimeout(() => window.location.reload(), 1000);
			})
			.catch(e => setAlert(`${lang.userRemovingFailure}`, AlertTypes.ERROR));

		removeResponsabilitiesAtUnsubscribing();
	}

	function toogleParticipation(): void {
		isUserIntoEvent() ? unsubscribeUserToEvent() : subscribeUserToEvent();
	}

	function toogleChef(): void {
		!event?.chef
			? editRoles(event?._id, { ...event, chef: actualUser })
					.then(res => {
						setAlert(`${lang.userResponsabilityChange}!`, AlertTypes.SUCCESS);
					})
					.catch(e => setAlert(`${lang.userResponsabilityFailure}`, AlertTypes.ERROR))
					.finally(() => setTimeout(() => window.location.reload(), 1000))
			: editRoles(event?._id, { ...event, chef: null })
					.then(res => {
						setAlert(`${lang.userResponsabilityChange}!`, AlertTypes.SUCCESS);
					})
					.catch(e => setAlert(`${lang.userResponsabilityFailure}`, AlertTypes.ERROR))
					.finally(() => setTimeout(() => window.location.reload(), 1000));
	}

	function toogleShopDesignee(): void {
		!event?.shoppingDesignee
			? editRoles(event?._id, { ...event, shoppingDesignee: actualUser })
					.then(res => {
						setAlert(`${lang.userResponsabilityChange}!`, AlertTypes.SUCCESS);
					})
					.catch(e => setAlert(`${lang.userResponsabilityFailure}`, AlertTypes.ERROR))
					.finally(() => setTimeout(() => window.location.reload(), 1000))
			: editRoles(event?._id, { ...event, shoppingDesignee: null })
					.then(res => {
						setAlert(`${lang.userResponsabilityChange}!`, AlertTypes.SUCCESS);
					})
					.catch(e => setAlert(`${lang.userResponsabilityFailure}`, AlertTypes.ERROR))
					.finally(() => setTimeout(() => window.location.reload(), 1000));
	}

	function deleteTheEvent(): void {
		deleteEvent(event?._id)
			.then(res => {
				setAlert(`${lang.eventDeleted}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.eventDeletingFailure}`, AlertTypes.ERROR))
			.finally(() => navigate('/'));
	}

	function closeEvent(): void {
		event.chef && event.shoppingDesignee
			? editEvent(event?._id, { ...event, state: 'closed' })
					.then(res => {
						setAlert(`${lang.eventClosed}!`, AlertTypes.SUCCESS);
					})
					.catch(e => setAlert(`${lang.eventClosingFailure}`, AlertTypes.ERROR))
					.finally(() => setTimeout(() => window.location.reload(), 1000))
			: setAlert(`${lang.unassignAtClosing}`, AlertTypes.ERROR);
	}

	function reopenEvent(): void {
		//TODO: deuda tecnica hacer una sola funcion para closeEvent y reopenEvent --> algo como: toogleEvent
		editEvent(event?._id, { ...event, state: 'available' })
			.then(res => {
				setAlert(`${lang.eventClosed}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.eventClosingFailure}`, AlertTypes.ERROR))
			.finally(() => setTimeout(() => window.location.reload(), 1000));
	}

	function payCheck(): void {
		setModalState(true);
	}

	function closeModal(): void {
		setModalState(false);
	}

	function closeModalPurchaseRecipt(): void {
		setModalPurchaseRecipt(false);
	}

	function openModal(): void {
		setModalState(true);
	}

	function openModalPurchaseRecipt(): void {
		setModalPurchaseRecipt(true);
	}

	function deletePurchase(purchase: IPurchaseReceipt): any {
		deleteEventPurchase(purchase._id, event._id)
			.then(res => {
				setAlert(lang.purchaseDeleted, AlertTypes.SUCCESS);
				setTimeout(() => window.location.reload(), 1000);
			})
			.catch(e => setAlert(lang.purchaseDeletedError, AlertTypes.ERROR));
	}

	async function downloadPurchase(purchase: IPurchaseReceipt) {
		try {
			const purchaseImage = await getImage(purchase.image);
			downloadFile({ file: purchaseImage, fileName: purchase.description });
		} catch (e) {
			setAlert(lang.downloadingImageError, AlertTypes.ERROR);
		}
	}

	useEffect(() => {
		const abortController = new AbortController();
		getEventById(userIdParams.eventId, abortController.signal)
			.then(res => {
				setEvent(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});

		return () => abortController.abort();
	}, []);

	useEffect(() => {
		const abortController = new AbortController();
		if (event?._id) {
			getPurchaseReceipts(event?._id, abortController.signal)
				.then(res => {
					setPurchasesMade(res);
				})
				.catch(e => {
					console.error('Catch in context: ', e);
				});
		}
	}, [event]);

	useEffect(() => {
		const abortController = new AbortController();
		if (user) {
			getUserById(user?.id, abortController.signal)
				.then(res => {
					setActualUser(res);
				})
				.catch(e => {
					console.error('Catch in context: ', e);
				});
		}
	}, [user]);

	useEffect(() => {
		setEvent(event);
	}, [user, actualUser, event]);

	useEffect(() => {
		const abortController = new AbortController();
		actualUser &&
			hasUploadedTransferReceipt(actualUser._id, event?._id, abortController.signal)
				.then(res => {
					setUserHasPaid(res.hasUploaded);
				})
				.catch(e => {
					console.error('Catch in context: ', e);
				});
	}, [actualUser, event]);

	return (
		<PrivateFormLayout>
			<div className={styles.content}>
				<section className={styles.header}>
					<h1>{lang.messageBanner}</h1>
					<Button kind="primary" size="large" onClick={() => navigate('/createEvent')}>
						{lang.newEventButton}
					</Button>
				</section>
				{!!event && (
					<section className={styles.event}>
						<h1>{event.title}</h1>
						<main className={styles.eventData}>
							<div className={styles.eventOrganization}>
								<div className={styles.sectionTitle}>
									<div className={styles.calendarLogo}></div>
									<h3 className={styles.logoTitle}>{lang.organizationTitle}</h3>
								</div>
								<h5 className={styles.infoData}>
									{lang.date} {getOnlyDate(new Date(event.datetime))}
								</h5>
								<h5 className={styles.infoData}>
									{lang.time} {getOnlyHour(new Date(event.datetime))}
								</h5>
								<h5 className={styles.infoData}>
									{lang.organizer} {event.organizer.name}
								</h5>

								<div className={styles.secondRow}>
									<div className={styles.sectionTitle}>
										<div className={styles.restaurantLogo}></div>
										<h3 className={styles.logoTitle}>{lang.menu}</h3>
									</div>
									<h5 className={styles.infoData}>{event.description}</h5>
								</div>

								<div className={styles.secondRow}>
									<div className={styles.sectionTitle}>
										<div className={styles.cartLogo}></div>
										<h3 className={styles.logoTitle}>{lang.purchasesMade}</h3>
									</div>
									{purchasesMade.map((purchase: IPurchaseReceipt) => (
										<div className={styles.purchasesData}>
											<h5 className={styles.infoData}>{purchase.description}</h5>
											<h5 className={styles.infoData}>{'$ ' + purchase.amount}</h5>
											{event?.shoppingDesignee._id === user?.id && (
												<button
													className={styles.deleteBtn}
													onClick={e => {
														e.preventDefault();
														deletePurchase(purchase);
													}}></button>
											)}
											<button
												className={styles.downloadBtn}
												onClick={e => {
													e.preventDefault();
													downloadPurchase(purchase);
												}}></button>
										</div>
									))}
								</div>
							</div>
							<div className={styles.eventParticipants}>
								<div className={styles.sectionTitle}>
									<div className={styles.inChargeLogo}></div>
									<h3 className={styles.logoTitle}>{lang.inchargeTitle}</h3>
								</div>
								<div className={styles.inChargeOpt}>
									<h5 className={styles.infoData}>
										{lang.cook}
										{event.chef ? (event.chef._id === user?.id ? ' Me' : event.chef.name) : 'Vacante'}
									</h5>

									{event.chef && event.chef._id === user?.id && event.state !== 'closed' && isUserIntoEvent() && (
										<AssignBtn key={user?.id} kind="unAssign" onClick={() => toogleChef()}></AssignBtn>
									)}
									{!event.chef && event.state !== 'closed' && isUserIntoEvent() && (
										<AssignBtn key={user?.id} kind="assign" onClick={() => toogleChef()}></AssignBtn>
									)}
								</div>
								<div className={styles.inChargeOpt}>
									<h5 className={styles.infoData}>
										{lang.buyer}{' '}
										{event.shoppingDesignee
											? event.shoppingDesignee._id === user?.id
												? lang.meOpt
												: event.shoppingDesignee.name
											: lang.emptyOpt}
									</h5>
									{event.shoppingDesignee &&
										event.shoppingDesignee._id === user?.id &&
										event.state !== 'closed' &&
										isUserIntoEvent() && (
											<AssignBtn key={user?.id} kind="unAssign" onClick={() => toogleShopDesignee()}></AssignBtn>
										)}
									{!event.shoppingDesignee && event.state !== 'closed' && isUserIntoEvent() && (
										<AssignBtn key={user?.id} kind="assign" onClick={() => toogleShopDesignee()}></AssignBtn>
									)}
								</div>
								<div className={styles.secondRow}>
									<div className={styles.participantsTitle}></div>
									<div className={styles.sectionTitle}>
										<div className={styles.participantsLogo}></div>
										<h3 className={styles.logoTitle}>
											{lang.diners} {event.members.length}/{event.memberLimit}
										</h3>
									</div>
									{event.members.map((member: IUser) => (
										<h5 className={styles.infoData}>{member.name}</h5>
									))}
								</div>
							</div>
						</main>

						<section className={styles.btnSection}>
							{event.state === 'available' && (
								<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => toogleParticipation()}>
									{isUserIntoEvent() ? 'Bajarse' : 'Sumarse'}
								</Button>
							)}
							{event.organizer && event.organizer._id === user?.id && (
								<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => deleteTheEvent()}>
									{lang.deleteEventBtn}
								</Button>
							)}
							{event.organizer && event.organizer._id === user?.id && event.state !== 'closed' && (
								<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => closeEvent()}>
									{lang.closeEventBtn}
								</Button>
							)}
							{event.organizer && event.organizer._id === user?.id && event.state === 'closed' && (
								<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => reopenEvent()}>
									{lang.reopenEventBtn}
								</Button>
							)}
							{event.shoppingDesignee &&
								event.shoppingDesignee._id !== user?.id &&
								event.state === 'closed' &&
								!userHasPaid &&
								(event.purchaseReceipts.length as number) === 0 && (
									<Button className={styles.btnEvent} kind="tertiary" size="short">
										{lang.payBtn}
									</Button>
								)}

							{event.shoppingDesignee &&
								event.shoppingDesignee._id !== user?.id &&
								event.state === 'closed' &&
								(event.purchaseReceipts.length as number) !== 0 &&
								(!userHasPaid ? (
									<Button className={styles.btnEvent} kind="primary" size="short" onClick={() => payCheck()}>
										{lang.payBtn}
									</Button>
								) : (
									//testear que esto funcione bien
									<Button className={styles.btnEvent} kind="primary" size="short" onClick={() => payCheck()}>
										{lang.uploadPay}
									</Button>
								))}
							{event.shoppingDesignee && event.shoppingDesignee._id === user?.id && event.state === 'closed' && (
								<Button className={styles.btnEvent} kind="primary" size="short" onClick={() => openModalPurchaseRecipt()}>
									{lang.loadPurchase}
								</Button>
							)}
						</section>
					</section>
				)}
			</div>
			<Modal isOpen={modalState} closeModal={() => closeModal}>
				<PayCheckForm
					event={event}
					shoppingDesignee={event?.shoppingDesignee}
					openModal={() => openModal}
					closeModal={() => closeModal}></PayCheckForm>
			</Modal>
			<Modal isOpen={modalPurchaseRecipt} closeModal={() => closeModalPurchaseRecipt}>
				<PurchaseReceiptForm
					event={event}
					openModal={() => openModalPurchaseRecipt}
					closeModal={() => closeModalPurchaseRecipt}></PurchaseReceiptForm>
			</Modal>
		</PrivateFormLayout>
	);
}
