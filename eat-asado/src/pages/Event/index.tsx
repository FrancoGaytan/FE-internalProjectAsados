import { useState, useEffect, JSX } from 'react';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import Stars from '../../components/micro/Stars/stars';
import styles from './styles.module.scss';
import { useAuth } from '../../stores/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
	getEventById,
	getMembersAmount,
	getMembersAndReceiptsInfo,
	getTransferReceipt,
	/* 	hasUploadedTransferReceipt, */
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
import PayCheckForm, { IUserReceiverInfo, PayCheckInfoResponse } from '../../components/macro/PayCheckForm/PayCheckForm';
import PurchaseReceiptForm from '../../components/macro/PurchaseReceiptForm/PurchaseReceiptForm';
import { getPurchaseReceipts, deleteEventPurchase, getImage } from '../../service/purchaseReceipts';
import { IPurchaseReceipt } from '../../models/purchases';
import { downloadFile } from '../../utils/utilities';
import ConfirmationPayForm from '../../components/macro/ConfirmationPayForm/ConfimationPayForm';
import { transferReceipt } from '../../models/transfer';
import Tooltip from '../../components/micro/Tooltip/Tooltip';
import ConfirmationFastApprovalForm from '../../components/macro/ConfirmationFastApprovalForm/ConfimationPayForm';

export function Event(): JSX.Element {
	const lang = useTranslation('eventHome');
	const { user, /* isRedirecting, */ setRedirection } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { setAlert } = useAlert();
	const [event, setEvent] = useState<any>(); //TODO: Sacar o typear este any
	const [actualUser, setActualUser] = useState<IUser>();
	const userIdParams = useParams();
	const [modalPaycheckState, setModalPaycheckState] = useState(false);
	const [modalValidationState, setModalValidationState] = useState(false);
	const [modalPurchaseRecipt, setModalPurchaseRecipt] = useState(false);
	const [modalFastAproval, setModalFastAproval] = useState(false);
	//const [userHasPaid, setUserHasPaid] = useState(false);
	const [purchasesMade, setPurchasesMade] = useState([]);
	const baseUrl = getBaseUrl();
	const currentUrl = `${baseUrl}${location.pathname}${location.search}${location.hash}`;
	const [transferReceiptId, setTransferReceiptId] = useState<string | undefined>(undefined);
	const [eventParticipants, setEventParticipants] = useState<EventUserResponse[]>([]);
	const [userToApprove, setUserToApprove] = useState('');
	const [transferReceipt, setTransferReceipt] = useState<transferReceipt>();
	const [paymentInfo, setPaymentInfo] = useState({ amount: 0, receiver: {} as IUserReceiverInfo });
	const [userToFastAprove, setUserToFastAprove] = useState('');
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
		event?.shoppingDesignee.length > 0 && event?.shoppingDesignee?.some((designee: IUser) => designee._id === user?.id) && toogleShopDesignee();
	}

	function unsubscribeUserToEvent(): void {
		if (!user) {
			return;
		}
		if (event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) {
			setAlert(`${lang.shoppingDesigneeTryingToGetOff}`, AlertTypes.ERROR);
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

		const currentDesignees = event?.shoppingDesignee || [];
		const isUserAlreadyDesignee = currentDesignees.some((designee: IUser) => designee._id === actualUser._id);

		let updatedDesignees;

		if (isUserAlreadyDesignee) {
			updatedDesignees = currentDesignees.filter((designee: IUser) => designee._id !== actualUser._id);
		} else {
			updatedDesignees = [...currentDesignees, actualUser];
		}

		editRoles(event?._id, { ...event, shoppingDesignee: updatedDesignees })
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
		//preguntarle a nani si cuando se cierra un evento quien tiene cero deuda ya se da por aprobado, sino como hacemos? ahí tendríamos que usar el readyforpayment, el cual todavía nose si esta implementado
		event.chef && event.shoppingDesignee.length > 0
			? editEvent(event?._id, { ...event, state: EventStatesEnum.CLOSED })
					.then(res => {
						setAlert(`${lang.eventClosed}!`, AlertTypes.SUCCESS);
						setTimeout(() => window.location.reload(), 1000);
					})
					.catch(e => setAlert(`${lang.eventClosingFailure}`, AlertTypes.ERROR))
			: setAlert(`${lang.unassignAtClosing}`, AlertTypes.ERROR);
	}

	function setEventToReadyForPay(): void {
		if ((event.purchaseReceipts.length as number) === 0) {
			setAlert(`${lang.eventCantBeReadyForPaymentWithoutPurchases}`, AlertTypes.ERROR);
			return;
		}
		event.chef && event.shoppingDesignee.length > 0
			? editEvent(event?._id, { ...event, state: EventStatesEnum.READYFORPAYMENT })
					.then(res => {
						setAlert(`${lang.eventReadyForPayment}!`, AlertTypes.SUCCESS);
						setTimeout(() => window.location.reload(), 1000);
					})
					.catch(e => setAlert(`${lang.eventClosingFailure}`, AlertTypes.ERROR))
			: setAlert(`${lang.unassignAtClosing}`, AlertTypes.ERROR);
	}

	function reclosingEvent(): void {
		event.chef && event.shoppingDesignee.length > 0 && event.state === EventStatesEnum.READYFORPAYMENT
			? editEvent(event?._id, { ...event, state: EventStatesEnum.CLOSED })
					.then(res => {
						setAlert(`${lang.eventClosed}!`, AlertTypes.SUCCESS); //TODO: cambiar los textos aca
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

	function closeModalFastAproval(): void {
		setModalFastAproval(false);
		setUserToApprove('');
	}

	function openModal(): void {
		setModalPaycheckState(true);
	}

	function openModalPurchaseRecipt(): void {
		setModalPurchaseRecipt(true);
	}

	function openModalFastAproval(userId: string): void {
		setUserToFastAprove(userId as string);
		setModalFastAproval(true);
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
		return (
			event.state === EventStatesEnum.READYFORPAYMENT && event.shoppingDesignee && event.shoppingDesignee.some((d: IUser) => d._id === user?.id)
		);
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

	useEffect(() => {
		function checkWhoDoesntNeedToTransfer(): void {
			//tengo que agregarle a esta funcion la validacion que ester readyforpay antes de ejecutarla
			const abortController = new AbortController();

			getMembersAmount(event?._id, abortController.signal)
				.then(res => {
					const myInfo = res.find((member: PayCheckInfoResponse) => member.userId === user?.id);
					if (myInfo?.amount === 0) {
						setPaymentInfo({ amount: 0, receiver: {} as IUserReceiverInfo });
					} else {
						setPaymentInfo({ amount: myInfo?.amount ?? 0, receiver: myInfo?.receiver ?? ({} as IUserReceiverInfo) });
					}
				})
				.catch(e => {
					console.error('Catch in context: ', e);
				});
		}
		checkWhoDoesntNeedToTransfer();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event]);

	function copyLinkEvent(): void {
		navigator.clipboard.writeText(currentUrl);
		setAlert(lang.linkCopiedToClipboard, AlertTypes.SUCCESS);
	}

	function editCurrentEvent(): void {
		navigate(`/createEvent/${event?._id}`);
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
					console.error('Catch in context: ', e);
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

	//event.state && console.log(event.state);
	console.log(paymentInfo);

	return (
		<PrivateFormLayout>
			<div className={styles.content}>
				<section className={styles.header}>
					<Button kind="primary" size="large" onClick={() => navigate('/createEvent/new')}>
						{lang.newEventButton}
					</Button>
				</section>
				{!!event && (
					<section className={styles.event}>
						{/* TODO: NO deberían haber dos h1 en la misma página */}
						<h1 className={styles.eventTitle}>{event.title}</h1>
						{isUserIntoEvent() &&
							(event.state === EventStatesEnum.CLOSED ||
								event.state === EventStatesEnum.FINISHED ||
								event.state === EventStatesEnum.READYFORPAYMENT) && (
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
								<section className={styles.eventBtns}>
									{event.isPrivate && <button className={styles.copyLinkToEvent} onClick={() => copyLinkEvent()}></button>}
									{event.organizer?._id === user?.id && (
										<button className={styles.editEventBtn} onClick={() => editCurrentEvent()}></button>
									)}
								</section>

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

								<h5 className={styles.infoData}>
									{lang.penalizationAmount + ':'} {event.penalization ? '$' + event.penalization : lang.noPenalizationAmount}
								</h5>

								{event.penalization > 0 && (
									<h5 className={styles.infoData}>
										{lang.penalizationStartDate} {getOnlyDate(new Date(event.penalizationStartDate))}
									</h5>
								)}

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
										<div className={styles.chefDesigneeSection}>
											<h5 className={styles.infoData}>
												{lang.cook}
												{event.chef ? (event.chef?._id === user?.id ? lang.me : event.chef.name) : lang.empty}
											</h5>
											{event.chef &&
												event.chef?._id === user?.id &&
												event.state !== EventStatesEnum.CLOSED &&
												event.state !== EventStatesEnum.READYFORPAYMENT &&
												isUserIntoEvent() && (
													<AssignBtn key={user?.id} kind="unAssign" onClick={() => toogleChef()}></AssignBtn>
												)}

											{!event.chef &&
												event.state !== EventStatesEnum.CLOSED &&
												event.state !== EventStatesEnum.READYFORPAYMENT &&
												isUserIntoEvent() && (
													<AssignBtn key={user?.id} kind="assign" onClick={() => toogleChef()}></AssignBtn>
												)}
										</div>
									</div>
									<div className={styles.inChargeOpt}>
										<div className={styles.shoppingDesigneeDescSection}>
											<h5 className={styles.infoData}>
												{lang.buyer} {event.shoppingDesignee.length === 0 && lang.empty}
											</h5>

											{!event.shoppingDesignee.length &&
												event.state !== EventStatesEnum.CLOSED &&
												event.state !== EventStatesEnum.READYFORPAYMENT &&
												isUserIntoEvent() && <AssignBtn kind="assign" onClick={() => toogleShopDesignee()}></AssignBtn>}
											{event.shoppingDesignee.length > 0 &&
												event.state !== EventStatesEnum.CLOSED &&
												event.state !== EventStatesEnum.READYFORPAYMENT &&
												isUserIntoEvent() &&
												!event.shoppingDesignee.some((d: IUser) => d._id === user?.id) && (
													<AssignBtn kind="add" onClick={() => toogleShopDesignee()}></AssignBtn>
												)}
										</div>
										<div className={styles.shoppingDesigneeSection}>
											{event.shoppingDesignee.length
												? event.shoppingDesignee.map((designee: IUser, i: number) => (
														<div key={designee._id} className={styles.singleDesigneeSection}>
															<h5>{designee._id === user?.id ? lang.meOpt : designee.name}</h5>

															{event.shoppingDesignee.length &&
																event.shoppingDesignee[i]._id === user?.id &&
																event.state !== EventStatesEnum.CLOSED &&
																event.state !== EventStatesEnum.READYFORPAYMENT &&
																isUserIntoEvent() && (
																	<AssignBtn kind="unAssign" onClick={() => toogleShopDesignee()}></AssignBtn>
																)}
														</div>
												  ))
												: ''}
										</div>
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
														<>
															<h5 className={styles.infoDataUsernameDidntPay}>{lang.pendingNoti}</h5>
															<button
																className={styles.fastAproveBtn}
																onClick={e => {
																	e.preventDefault();
																	openModalFastAproval(member.userId);
																}}></button>
														</>
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
								isUserIntoEvent() &&
								(event.organizer?._id === user?.id || event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) &&
								event.state !== 'finished' &&
								event.state !== EventStatesEnum.READYFORPAYMENT &&
								event.state !== EventStatesEnum.AVAILABLE && (
									<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => setEventToReadyForPay()}>
										Ready for payment
									</Button>
								)}

							{event.organizer &&
								isUserIntoEvent() &&
								(event.organizer?._id === user?.id || event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) &&
								event.state !== 'finished' &&
								event.state !== EventStatesEnum.CLOSED && (
									<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => closeEvent()}>
										{lang.closeEventBtn}
									</Button>
								)}

							{event.organizer &&
								isUserIntoEvent() &&
								(event.organizer?._id === user?.id || event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) &&
								event.state === EventStatesEnum.CLOSED && (
									<Button className={styles.btnEvent} kind="secondary" size="short" onClick={() => reopenEvent()}>
										{lang.reopenEventBtn}
									</Button>
								)}

							{/* 							{event.shoppingDesignee &&//este boton deshabilitado no recuerdo para que caso funcionaba
								(event.organizer?._id === user?.id || event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) &&
								event.state === EventStatesEnum.READYFORPAYMENT &&
								isUserIntoEvent() &&
								//!userHasPaid &&
								paymentInfo.amount !== 0 &&
								(event.purchaseReceipts.length as number) !== 0 && (
									<Button className={styles.btnEvent} kind="tertiary" size="short">
										{lang.payBtn}
									</Button>
								)} */}

							{event.shoppingDesignee &&
								//(event.organizer?._id === user?.id || event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) &&
								event.state === EventStatesEnum.READYFORPAYMENT &&
								isUserIntoEvent() &&
								paymentInfo.amount !== 0 &&
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

							{event.shoppingDesignee &&
								(event.organizer?._id === user?.id || event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) &&
								event.state === EventStatesEnum.CLOSED &&
								event.state !== EventStatesEnum.READYFORPAYMENT && (
									<Button className={styles.btnEvent} kind="primary" size="short" onClick={() => openModalPurchaseRecipt()}>
										{lang.loadPurchase}
									</Button>
								)}
						</section>
					</section>
				)}
			</div>

			<Modal isOpen={modalPaycheckState} closeModal={closeModal}>
				{/* estos shopping designees va a haber que cambiarlos todos  */}
				<PayCheckForm
					event={event}
					shoppingDesignee={paymentInfo.receiver}
					amount={paymentInfo.amount}
					openModal={openModal}
					closeModal={closeModal}></PayCheckForm>
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

			<Modal isOpen={modalFastAproval} closeModal={closeModalFastAproval}>
				<ConfirmationFastApprovalForm
					eventId={userIdParams.eventId as string}
					userId={userToFastAprove}
					closeModal={closeModalFastAproval}></ConfirmationFastApprovalForm>
			</Modal>
		</PrivateFormLayout>
	);
}
