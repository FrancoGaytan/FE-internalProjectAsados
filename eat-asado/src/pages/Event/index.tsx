import { useState, useEffect } from 'react';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import Stars from '../../components/micro/Stars/stars';
import styles from './styles.module.scss';
import { useAuth } from '../../stores/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
	getEventById,
	getMembersAndReceiptsInfo,
	getTransferReceipt,
	hasUploadedTransferReceipt,
	subscribeToAnEvent,
	unsubscribeToAnEvent
} from '../../service';
import { EventStatesEnum } from '../../enums/EventState.enum';
import { useParams, useLocation } from 'react-router-dom';
import { EventUserResponse, IUser } from '../../models/user';
import AssignBtn from '../../components/micro/AssignBtn/AssignBtn';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { getUserById, editRoles, deleteEvent, editEvent } from '../../service';
import Modal from '../../components/macro/Modal/Modal';
import PayCheckForm from '../../components/macro/PayCheckForm/PayCheckForm';
import PurchaseReceiptForm from '../../components/macro/PurchaseReceiptForm/PurchaseReceiptForm';
import { getPurchaseReceipts, deleteEventPurchase, getImage } from '../../service/purchaseReceipts';
import { IPurchaseReceipt } from '../../models/purchases';
import { downloadFile } from '../../utils/utilities';
import ConfirmationPayForm from '../../components/macro/ConfirmationPayForm/ConfimationPayForm';
import { transferReceipt } from '../../models/transfer';
import Tooltip from '../../components/micro/Tooltip/Tooltip';

export function Event(): JSX.Element {
	const lang = useTranslation('eventHome');
	const { user, isRedirecting, setRedirection } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { setAlert } = useAlert();
	const [event, setEvent] = useState<any>(); //TODO: Sacar o typear este any
	const [actualUser, setActualUser] = useState<IUser>();
	const userIdParams = useParams();
	const [modalPaycheckState, setModalPaycheckState] = useState(false);
	const [modalValidationState, setModalValidationState] = useState(false);
	const [modalPurchaseRecipt, setModalPurchaseRecipt] = useState(false);
	const [userHasPaid, setUserHasPaid] = useState(false);
	const [purchasesMade, setPurchasesMade] = useState([]);
	const baseUrl = getBaseUrl();
	const currentUrl = `${baseUrl}${location.pathname}${location.search}${location.hash}`;
	const [transferReceiptId, setTransferReceiptId] = useState<string | undefined>(undefined);
	const [eventParticipants, setEventParticipants] = useState<EventUserResponse[]>([]);
	const [userToApprove, setUserToApprove] = useState('');
	const [transferReceipt, setTransferReceipt] = useState<transferReceipt>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	//faltaria un estado para  el  userHasPaid para el  usuario que esta abriendo el evento, hacerlo junto con el setUserHasUploaded

	function parseMinutes(minutes: string) {
		let newMinutes = minutes;
		if (Number(minutes) < 10) {
			newMinutes = '0' + minutes;
		}
		return newMinutes;
	}

	function getOnlyDate(evDateTime: Date) {
		return evDateTime.getDate().toString() + '. ' + (evDateTime.getMonth() + 1).toString() + '. ' + evDateTime.getFullYear().toString() + '.';
	}

	function getOnlyHour(evDateTime: Date) {
		return (evDateTime.getHours() + 3).toString() + ':' + parseMinutes(evDateTime.getMinutes().toString());
	}

	function isUserIntoEvent(): Boolean {
		const ev = event.members;
		return ev.find((member: { _id: string }) => member._id === user?.id);
	}

	function subscribeUserToEvent(): void {
		if (Object.keys(user as Object).length === 0) {
			setAlert(lang.needLoginRedirecting, AlertTypes.INFO);
			setTimeout(() => {
				setRedirection(`${location.pathname}${location.search}${location.hash}`);
				navigate('/login');
			}, 1500);
			return;
		} else {
			setIsLoading(true);
			subscribeToAnEvent(user?.id as string, event?._id)
				.then(res => {
					setAlert(`${lang.userAddedSuccessfully}!`, AlertTypes.SUCCESS);
					setTimeout(() => window.location.reload(), 1000);
				})
				.catch(e => setAlert(`${lang.userAddingFailure}`, AlertTypes.ERROR))
				.finally(() => setIsLoading(false));
		}
	}

	function removeResponsabilitiesAtUnsubscribing(): void {
		event?.chef && event?.chef?._id === user?.id && toogleChef();
		event?.shoppingDesignee && event?.shoppingDesignee?._id === user?.id && toogleShopDesignee();
	}

	function unsubscribeUserToEvent(): void {
		if (!user) {
			return;
		}
		removeResponsabilitiesAtUnsubscribing();

		unsubscribeToAnEvent(user?.id as string, event?._id)
			.then(res => {
				setAlert(`${lang.userRemovedSuccessfully}!`, AlertTypes.SUCCESS);
				setTimeout(() => window.location.reload(), 1000);
			})
			.catch(e => setAlert(`${lang.userRemovingFailure}`, AlertTypes.ERROR));
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
		if (!(actualUser?.cbu || actualUser?.alias)) {
			setAlert(`${lang.paymentDataIsNecessary}`, AlertTypes.INFO);
			return;
		}

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
			? editEvent(event?._id, { ...event, state: EventStatesEnum.CLOSED })
					.then(res => {
						setAlert(`${lang.eventClosed}!`, AlertTypes.SUCCESS);
						setTimeout(() => window.location.reload(), 1000);
					})
					.catch(e => setAlert(`${lang.eventClosingFailure}`, AlertTypes.ERROR))
			: setAlert(`${lang.unassignAtClosing}`, AlertTypes.ERROR);
	}

	function reopenEvent(): void {
		//TODO: deuda tecnica hacer una sola funcion para closeEvent y reopenEvent --> algo como: toogleEvent
		editEvent(event?._id, { ...event, state: EventStatesEnum.AVAILABLE })
			.then(res => {
				setAlert(`${lang.eventOpen}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.eventClosingFailure}`, AlertTypes.ERROR))
			.finally(() => setTimeout(() => window.location.reload(), 1000));
	}

	function payCheck(): void {
		setModalPaycheckState(true);
	}

	function closeModal(): void {
		setModalPaycheckState(false);
	}

	function closeModalPurchaseRecipt(): void {
		setModalPurchaseRecipt(false);
	}

	function openModal(): void {
		setModalPaycheckState(true);
	}

	function openModalPurchaseRecipt(): void {
		setModalPurchaseRecipt(true);
	}

	function openValidationPopup(): void {
		setModalValidationState(true);
	}

	function closeValidationPopup() {
		setModalValidationState(false);
	}

	function deletePurchase(purchase: IPurchaseReceipt): any {
		deleteEventPurchase(purchase?._id, event?._id)
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

	function showPaymentData() {
		return event.state === EventStatesEnum.CLOSED && event.shoppingDesignee && event.shoppingDesignee?._id === user?.id;
	}

	function actualUserIsShoppingDesignee(member: EventUserResponse) {
		return !(member.userId === user?.id);
	}

	function checkIfUserHasUploaded() {
		const myReceipt = eventParticipants.find(member => member.userId === user?.id);
		return myReceipt?.hasUploaded;
	}

	function checkIfUserHasPaid() {
		const myReceipt = eventParticipants.find(member => member.userId === user?.id);
		return myReceipt?.hasReceiptApproved;
	}

	function isEventFull(): boolean {
		return event.members.length >= event.memberLimit;
	}

	function showDiets(): boolean {
		return event.shoppingDesignee?._id === user?.id || event.chef?._id === user?.id || event.organizer?._id === user?.id;
	}

	function getBaseUrl(): string {
		if (process.env.NODE_ENV === 'development') {
			return 'http://localhost:3000';
		} else {
			return window.location.origin;
		}
	}

	function copyLinkEvent(): void {
		navigator.clipboard.writeText(currentUrl);
		setAlert(lang.linkCopiedToClipboard, AlertTypes.SUCCESS);
	}

	useEffect(() => {
		if (!userIdParams) {
			return;
		} else {
			getEventById(userIdParams.eventId)
				.then(res => {
					setEvent(res);
				})
				.catch(e => {
					console.error('Catch in context: ', e);
				});
		}
	}, [userIdParams]);

	useEffect(() => {
		if (!event) {
			return;
		} else {
			getPurchaseReceipts(event?._id)
				.then(res => {
					setPurchasesMade(res);
				})
				.catch(e => {
					//console.error('Catch in context: ', e);
				});
		}
	}, [event]);

	useEffect(() => {
		if (!user) return;

		getUserById(user?.id)
			.then(res => {
				setActualUser(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});
	}, [user]);

	useEffect(() => {
		setEvent(event);
	}, [user, actualUser, event]);

	useEffect(() => {
		if (!event?._id) {
			return;
		}
		const abortController = new AbortController();
		getMembersAndReceiptsInfo(event?._id, abortController.signal)
			.then(res => {
				setEventParticipants(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});
	}, [event]);

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
						{/* TODO: NO deberían haber dos h1 en la misma página */}
						<h1 className={styles.eventTitle}>{event.title}</h1>
						{isUserIntoEvent() && (event.state === EventStatesEnum.CLOSED || event.state === EventStatesEnum.FINISHED) && (
							<Stars iconSize={25} count={5} defaultRating={0} icon={'★'} color="rgb(240, 191, 28)" idEvent={event._id}></Stars>
						)}

						{event.isPrivate && (
							<section className={styles.eventPrivate}>
								<div className={styles.privateLogo}></div>
								<p className={styles.privateDescription}>{lang.privateEvent}</p>
							</section>
						)}
						<main className={styles.eventData}>
							<div className={styles.eventOrganization}>
								{event.isPrivate && <button className={styles.copyLinkToEvent} onClick={() => copyLinkEvent()}></button>}
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
										<div className={styles.restaurantLogo} />

										<h3 className={styles.logoTitle}>{lang.menu}</h3>
									</div>
									<h5 className={styles.infoData}>{event.description}</h5>
								</div>

								<div className={styles.secondRow}>
									<div className={styles.sectionTitle}>
										<div className={styles.cartLogo}></div>
										<h3 className={styles.logoTitle}>{lang.purchasesMade}</h3>
									</div>
									{isUserIntoEvent() && (
										<section className={styles.purchasesList}>
											{purchasesMade.map((purchase: IPurchaseReceipt) => (
												<div key={purchase?._id} className={styles.purchasesData}>
													<h5 className={styles.infoData}>{purchase.description}</h5>

													<h5 className={styles.infoData}>{'$ ' + purchase.amount}</h5>

													{event?.shoppingDesignee?._id === user?.id && (
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
										</section>
									)}
								</div>
							</div>
							<div className={styles.eventParticipants}>
								<div className={styles.sectionTitle}>
									<div className={styles.inChargeLogo}></div>

									<h3 className={styles.logoTitle}>{lang.inchargeTitle}</h3>
								</div>

								<div className={styles.responsibilitiesSection}>
									<div className={styles.inChargeOpt}>
										<h5 className={styles.infoData}>
											{lang.cook}
											{event.chef ? (event.chef?._id === user?.id ? lang.me : event.chef.name) : lang.empty}
										</h5>

										{event.chef &&
											event.chef?._id === user?.id &&
											event.state !== EventStatesEnum.CLOSED &&
											isUserIntoEvent() && <AssignBtn key={user?.id} kind="unAssign" onClick={() => toogleChef()}></AssignBtn>}

										{!event.chef && event.state !== EventStatesEnum.CLOSED && isUserIntoEvent() && (
											<AssignBtn key={user?.id} kind="assign" onClick={() => toogleChef()}></AssignBtn>
										)}
									</div>
									<div className={styles.inChargeOpt}>
										<h5 className={styles.infoData}>
											{lang.buyer}{' '}
											{event.shoppingDesignee
												? event.shoppingDesignee?._id === user?.id
													? lang.meOpt
													: event.shoppingDesignee.name
												: lang.emptyOpt}
										</h5>

										{event.shoppingDesignee &&
											event.shoppingDesignee?._id === user?.id &&
											event.state !== EventStatesEnum.CLOSED &&
											isUserIntoEvent() && (
												<AssignBtn key={user?.id} kind="unAssign" onClick={() => toogleShopDesignee()}></AssignBtn>
											)}

										{!event.shoppingDesignee && event.state !== EventStatesEnum.CLOSED && isUserIntoEvent() && (
											<AssignBtn key={user?.id} kind="assign" onClick={() => toogleShopDesignee()}></AssignBtn>
										)}
									</div>
								</div>

								<div className={styles.secondRow}>
									<div className={styles.participantsTitle}></div>

									<div className={styles.sectionTitle}>
										<div className={styles.participantsLogo} />

										<h3 className={styles.logoTitle}>
											{lang.diners} {event.members.length}/{event.memberLimit}
										</h3>
									</div>

									<section className={styles.infoParticipants}>
										{eventParticipants.map((member: EventUserResponse, i: number) => (
											<div key={`participants-key-${i}`} className={styles.infoData}>
												{showDiets() ? (
													<Tooltip
														infoText={!!member.specialDiet.length ? member.specialDiet.join(', ') : lang.noSpecialDiet}>
														<h5 className={styles.infoDataUsername}>
															{member.userName} {member.userLastName}
														</h5>
													</Tooltip>
												) : (
													<h5 className={styles.infoDataUsername}>
														{member.userName} {member.userLastName}
													</h5>
												)}

												{showPaymentData() &&
													actualUserIsShoppingDesignee(member) &&
													(member.hasReceiptApproved ? (
														<h5 className={styles.infoDataUsernamePayed}>{lang.paidNoti}</h5>
													) : member.hasUploaded ? (
														<Button
															className={styles.btnEvent}
															kind="validation"
															size="micro"
															onClick={() => {
																setTransferReceiptId(member.transferReceipt);
																openValidationPopup();
																setUserToApprove(member.userId);
															}}>
															{lang.validateBtn}
														</Button>
													) : (
														<h5 className={styles.infoDataUsernameDidntPay}>{lang.pendingNoti}</h5>
													))}
											</div>
										))}
									</section>
								</div>
							</div>
						</main>
						<section className={styles.btnSection}>
							{event.state === EventStatesEnum.AVAILABLE && !isLoading && (
								<div>
									{!isUserIntoEvent() && isEventFull() ? (
										<Button className={styles.btnEvent} kind="tertiary" size="short">
											{EventStatesEnum.FULL}
										</Button>
									) : (
										<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => toogleParticipation()}>
											{isUserIntoEvent() ? lang.getOff : !isEventFull() && lang.getInto}
										</Button>
									)}
								</div>
							)}

							{event.organizer && event.organizer?._id === user?.id && (
								<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => deleteTheEvent()}>
									{lang.deleteEventBtn}
								</Button>
							)}

							{event.organizer &&
								(event.organizer?._id === user?.id || event.shopopingDesignee?._id === user?.id) &&
								event.state !== 'finished' &&
								event.state !== EventStatesEnum.CLOSED && (
									<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => closeEvent()}>
										{lang.closeEventBtn}
									</Button>
								)}

							{event.organizer &&
								(event.organizer?._id === user?.id || event.shopopingDesignee?._id === user?.id) &&
								event.state === EventStatesEnum.CLOSED && (
									<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => reopenEvent()}>
										{lang.reopenEventBtn}
									</Button>
								)}

							{event.shoppingDesignee &&
								event.shoppingDesignee?._id !== user?.id &&
								event.state === EventStatesEnum.CLOSED &&
								isUserIntoEvent() &&
								!userHasPaid &&
								(event.purchaseReceipts.length as number) === 0 && (
									<Button className={styles.btnEvent} kind="tertiary" size="short">
										{lang.payBtn}
									</Button>
								)}

							{event.shoppingDesignee &&
								event.shoppingDesignee?._id !== user?.id &&
								event.state === EventStatesEnum.CLOSED &&
								isUserIntoEvent() &&
								(event.purchaseReceipts.length as number) !== 0 &&
								(!checkIfUserHasUploaded() ? (
									<Button className={styles.btnEvent} kind="primary" size="short" onClick={() => payCheck()}>
										{lang.payBtn}
									</Button>
								) : (
									!checkIfUserHasPaid() && (
										<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => payCheck()}>
											{lang.modifyPay}
										</Button>
									)
								))}

							{event.shoppingDesignee && event.shoppingDesignee?._id === user?.id && event.state === EventStatesEnum.CLOSED && (
								<Button className={styles.btnEvent} kind="primary" size="short" onClick={() => openModalPurchaseRecipt()}>
									{lang.loadPurchase}
								</Button>
							)}
						</section>
					</section>
				)}
			</div>

			<Modal isOpen={modalPaycheckState} closeModal={closeModal}>
				<PayCheckForm event={event} shoppingDesignee={event?.shoppingDesignee} openModal={openModal} closeModal={closeModal}></PayCheckForm>
			</Modal>

			<Modal isOpen={modalPurchaseRecipt} closeModal={closeModalPurchaseRecipt}>
				<PurchaseReceiptForm event={event} openModal={openModalPurchaseRecipt} closeModal={closeModalPurchaseRecipt}></PurchaseReceiptForm>
			</Modal>

			<Modal isOpen={modalValidationState} closeModal={closeValidationPopup}>
				<ConfirmationPayForm
					event={event}
					transferReceiptId={transferReceiptId}
					openModal={() => openValidationPopup}
					closeModal={() => closeValidationPopup}></ConfirmationPayForm>
			</Modal>
		</PrivateFormLayout>
	);
}
