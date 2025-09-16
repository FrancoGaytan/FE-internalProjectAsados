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
	getMemberIndividualCost,
	getMembersAmount,
	getMembersAndReceiptsInfo,
	getTransferReceipt,
	isUserDebtor,
	subscribeToAnEvent,
	unsubscribeToAnEvent
} from '../../service';
import { EventStatesEnum } from '../../enums/EventState.enum';
import { useParams, useLocation } from 'react-router-dom';
import { EventUserResponse, IUser, IPublicUser, IsUserDebtorResponse } from '../../models/user';
import AssignBtn from '../../components/micro/AssignBtn/AssignBtn';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { getUserById, editRoles, deleteEvent, editEvent } from '../../service';
import Modal from '../../components/macro/Modal/Modal';
import PayCheckForm, { IUserReceiverInfo, PayCheckInfoResponse } from '../../components/macro/PayCheckForm/PayCheckForm';
import PurchaseReceiptForm from '../../components/macro/PurchaseReceiptForm/PurchaseReceiptForm';
import { getPurchaseReceipts, deleteEventPurchase, getImage } from '../../service/purchaseReceipts';
import { IPurchaseReceipt } from '../../models/purchases';
import { ITransferReceiptResponse } from '../../models/transfer';
import FilesPreview from '../../components/macro/FilesPreview/FilesPreview';
import ConfirmationPayForm from '../../components/macro/ConfirmationPayForm/ConfimationPayForm';
import Tooltip from '../../components/micro/Tooltip/Tooltip';
import ConfirmationFastAprovalForm from '../../components/macro/ConfirmationFastAprovalForm/ConfimationPayForm';
import AssignationTable from '../../components/macro/AssignationTable/AssignationTable';
import { EventByIdResponse } from '../../models/event';
import FoodSurvey from '../../components/macro/FoodSurvey/FoodSurvey';
import { IOption } from '../../models/options';

export interface FilePreview {
	uri: string;
	fileType?: string;
	fileName?: string;
}

export function Event(): JSX.Element {
	const lang = useTranslation('eventHome');
	const { user, /* isRedirecting, */ setRedirection } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { setAlert } = useAlert();
	const [event, setEvent] = useState<EventByIdResponse>();
	const [currentUser, setcurrentUser] = useState<IPublicUser>();
	const userIdParams = useParams();
	const [modalPaycheckState, setModalPaycheckState] = useState(false);
	const [modalValidationState, setModalValidationState] = useState(false);
	const [modalPurchaseRecipt, setModalPurchaseRecipt] = useState(false);
	const [modalFastAproval, setModalFastAproval] = useState(false);
	const [modalAssignation, setModalAssignation] = useState(false);
	const [purchasesMade, setPurchasesMade] = useState<IPurchaseReceipt[]>([]);
	const baseUrl = getBaseUrl();
	const currentUrl = `${baseUrl}${location.pathname}${location.search}${location.hash}`;
	const [transferReceiptId, setTransferReceiptId] = useState<string | undefined>(undefined);
	const [eventParticipants, setEventParticipants] = useState<EventUserResponse[]>([]);
	const [userToApprove, setUserToApprove] = useState('');
	const [totalPaymentInfo, setTotalPaymentInfo] = useState<PayCheckInfoResponse[]>([]);
	const [transferReceipt, setTransferReceipt] = useState<ITransferReceiptResponse>();
	const [paymentInfo, setPaymentInfo] = useState({ amount: 0, receiver: {} as IUserReceiverInfo });
	const [userToFastAprove, setUserToFastAprove] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSyncingEvent, setIsSyncingEvent] = useState<boolean>(false); // NUEVO
	const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
	const [openFilePreview, setOpenFilePreview] = useState<boolean>(false);
	const [userDebtor, setUserDebtor] = useState<boolean>(false);
	const [userPrice, setUserPrice] = useState<number>(0);
	const [modalSurvey, setModalSurvey] = useState<boolean>(false);

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
		if (!event) return false;
		const ev = event?.members;
		return !!ev.find((member: { _id: string }) => member._id === user?.id);
	}

	function isUserShoppingDesignee(): Boolean {
		if (!event) return false;
		const ev = event?.shoppingDesignee;
		return !!ev.find((member: { _id: string }) => member._id === user?.id);
	}

	function subscribeUserToEvent(): void {
		if (isLoading || isSyncingEvent) return;
		if (!event) return;
		if (userDebtor) {
			setAlert(lang.userDebtorWarning, AlertTypes.WARNING);
			return;
		}
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
					refetchEvent();
					setAlert(`${lang.userAddedSuccessfully}!`, AlertTypes.SUCCESS);
				})
				.catch(e => setAlert(`${lang.userAddingFailure}`, AlertTypes.ERROR))
				.finally(() => setIsLoading(false));
		}
	}

	function removeResponsabilitiesAtUnsubscribing(): void {
		if (!event) return;
		event?.chef && event?.chef?._id === user?.id && toogleChef();
		event?.shoppingDesignee.length > 0 && event?.shoppingDesignee?.some((designee: IUser) => designee._id === user?.id) && toogleShopDesignee();
	}

	function unsubscribeUserToEvent(): void {
		if (isLoading || isSyncingEvent) return;
		if (!event) return;
		if (!user) return;

		if (event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) {
			setAlert(`${lang.shoppingDesigneeTryingToGetOff}`, AlertTypes.ERROR);
			return;
		}
		removeResponsabilitiesAtUnsubscribing();

		setIsLoading(true);
		unsubscribeToAnEvent(user?.id as string, event?._id)
			.then(res => {
				refetchEvent();
				setAlert(`${lang.userRemovedSuccessfully}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.userRemovingFailure}`, AlertTypes.ERROR))
			.finally(() => setIsLoading(false));
	}

	function toogleParticipation(): void {
		if (isLoading || isSyncingEvent) return;
		isUserIntoEvent() ? unsubscribeUserToEvent() : subscribeUserToEvent();
	}

	function toogleChef(): void {
		if (isLoading || isSyncingEvent) return;
		if (!event) return;
		setIsLoading(true);
		!event?.chef
			? editRoles(event?._id, { ...event, chef: currentUser ?? null, isPrivate: event.isPrivate ?? false })
					.then(res => {
						setAlert(`${lang.userResponsabilityChange}!`, AlertTypes.SUCCESS);
					})
					.catch(e => setAlert(`${lang.userResponsabilityFailure}`, AlertTypes.ERROR))
					.finally(() => {
						refetchEvent();
						setIsLoading(false);
					})
			: editRoles(event?._id, { ...event, chef: null, isPrivate: event.isPrivate ?? false })
					.then(res => {
						setAlert(`${lang.userResponsabilityChange}!`, AlertTypes.SUCCESS);
					})
					.catch(e => setAlert(`${lang.userResponsabilityFailure}`, AlertTypes.ERROR))
					.finally(() => {
						refetchEvent();
						setIsLoading(false);
					});
	}

	function toogleShopDesignee(): void {
		if (isLoading || isSyncingEvent) return;
		if (!event) return;
		if (!(currentUser?.cbu || currentUser?.alias)) {
			setAlert(`${lang.paymentDataIsNecessary}`, AlertTypes.INFO);
			return;
		}

		if (purchasesMade.some((pur: IPurchaseReceipt) => pur.shoppingDesignee._id === currentUser._id)) {
			setAlert(`${lang.sdCanNotRemove}`, AlertTypes.INFO);
			return;
		}

		const currentDesignees = event?.shoppingDesignee || [];
		const isUserAlreadyDesignee = currentDesignees.some((designee: IPublicUser) => designee._id === currentUser._id);

		let updatedDesignees;

		if (isUserAlreadyDesignee) {
			updatedDesignees = currentDesignees.filter((designee: IPublicUser) => designee._id !== currentUser._id);
		} else {
			updatedDesignees = [...currentDesignees, currentUser];
		}

		setIsLoading(true);
		editRoles(event?._id, { ...event, shoppingDesignee: updatedDesignees, isPrivate: event.isPrivate ?? false })
			.then(res => {
				setAlert(`${lang.userResponsabilityChange}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.userResponsabilityFailure}`, AlertTypes.ERROR))
			.finally(() => {
				refetchEvent();
				setIsLoading(false);
			});
	}

	function deleteTheEvent(): void {
		if (isLoading || isSyncingEvent) return;
		if (!event) return;
		setIsLoading(true);
		deleteEvent(event?._id)
			.then(res => {
				setAlert(`${lang.eventDeleted}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.eventDeletingFailure}`, AlertTypes.ERROR))
			.finally(() => {
				setIsLoading(false);
				navigate('/');
			});
	}

	function closeEvent(): void {
		if (isLoading || isSyncingEvent) return;
		if (!event) return;
		if (eventParticipants.some(member => member.hasReceiptApproved)) {
			setAlert(`${lang.eventWithApprovedReceiptsCannotBeReclosed}`, AlertTypes.ERROR);
			return;
		}
		setIsLoading(true);
		if (event.shoppingDesignee.length > 0) {
			editEvent(event?._id, { ...event, state: EventStatesEnum.CLOSED, isPrivate: event.isPrivate ?? false })
				.then(res => {
					refetchEvent();
					setAlert(`${lang.eventClosed}!`, AlertTypes.SUCCESS);
				})
				.catch(e => setAlert(`${lang.eventClosingFailure}`, AlertTypes.ERROR))
				.finally(() => setIsLoading(false));
		} else {
			setIsLoading(false);
			setAlert(`${lang.unassignAtClosing}`, AlertTypes.ERROR);
		}
	}

	function setEventToReadyForPay(): void {
		if (isLoading || isSyncingEvent) return;
		if (!event) return;
		if ((event.purchaseReceipts.length as number) === 0) {
			setAlert(`${lang.eventCantBeReadyForPaymentWithoutPurchases}`, AlertTypes.ERROR);
			return;
		}
		setIsLoading(true);
		if (event.shoppingDesignee.length > 0) {
			editEvent(event?._id, { ...event, state: EventStatesEnum.READYFORPAYMENT, isPrivate: event.isPrivate ?? false })
				.then(res => {
					refetchEvent();
					setAlert(`${lang.eventReadyForPayment}!`, AlertTypes.SUCCESS);
				})
				.catch(e => setAlert(`${lang.eventClosingFailure}`, AlertTypes.ERROR))
				.finally(() => setIsLoading(false));
		} else {
			setIsLoading(false);
			setAlert(`${lang.unassignAtClosing}`, AlertTypes.ERROR);
		}
	}

	function reopenEvent(): void {
		if (isLoading || isSyncingEvent) return;
		if (event?._id === undefined) return;
		setIsLoading(true);
		editEvent(event?._id, { ...event, state: EventStatesEnum.AVAILABLE, isPrivate: event.isPrivate ?? false })
			.then(res => {
				setAlert(`${lang.eventOpen}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.eventClosingFailure}`, AlertTypes.ERROR))
			.finally(() => {
				refetchEvent();
				setIsLoading(false);
			});
	}

	function payCheck(): void {
		if (isLoading || isSyncingEvent) return;
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

	function closeModalAssignation(): void {
		setModalAssignation(false);
	}

	function closeModalSurvey(): void {
		setModalSurvey(false);
	}

	function openModalAssignation(): void {
		setModalAssignation(true);
	}

	function openModalSurvey(): void {
		setModalSurvey(true);
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
		if (isLoading || isSyncingEvent) return;
		setIsLoading(true);
		deleteEventPurchase(purchase?._id, event?._id)
			.then(res => {
				refetchEvent();
				setAlert(lang.purchaseDeleted, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(lang.purchaseDeletedError, AlertTypes.ERROR))
			.finally(() => setIsLoading(false));
	}

	function showPaymentData() {
		if (!event) return false;
		return (
			event.state === EventStatesEnum.READYFORPAYMENT &&
			event.shoppingDesignee &&
			event.shoppingDesignee.some((d: IUser) => d._id === currentUser?._id)
		);
	}

	function currentUserHasNoDebts(member: EventUserResponse) {
		return totalPaymentInfo.find((user: PayCheckInfoResponse) => user.userId === member.userId && user.amount === 0);
	}

	function currentUserPaysHasToPayMe(member: EventUserResponse) {
		return totalPaymentInfo.find(
			(userFinding: PayCheckInfoResponse) => userFinding.userId === member.userId && userFinding.receiver?.receiverId === user?.id
		);
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
		if (!event) return false;
		return event.members.length >= event.memberLimit;
	}

	function showDiets(): boolean {
		if (!event) return false;
		return (
			(event.shoppingDesignee && event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) ||
			event.chef?._id === user?.id ||
			event.organizer?._id === user?.id
		);
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
			const abortController = new AbortController();

			if (!event?._id) return;
			getMembersAmount(event?._id, abortController.signal)
				.then(res => {
					const myInfo = res.find((member: PayCheckInfoResponse) => member.userId === user?.id);
					setTotalPaymentInfo(res);
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

	async function PreviewPurchase(purchase: IPurchaseReceipt) {
		setOpenFilePreview(true);
		try {
			const purchaseImage = await getImage(purchase.image);
			const objectURL = URL.createObjectURL(purchaseImage);
			setFilePreview({
				uri: objectURL,
				fileType: purchaseImage.type.split('/')[1],
				fileName: 'File Preview'
			});

			setTimeout(() => {
				setOpenFilePreview(true);
			}, 1000);
		} catch (e) {
			console.log(e);
		}
	}

	function copyLinkEvent(): void {
		navigator.clipboard.writeText(currentUrl);
		setAlert(lang.linkCopiedToClipboard, AlertTypes.SUCCESS);
	}

	function editCurrentEvent(): void {
		navigate(`/createEvent/${event?._id}`);
	}

	function handleGoToMain(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		navigate('/');
	}

	function closeFilePreview(): void {
		setOpenFilePreview(false);
		setFilePreview(null);
	}

	// Cambios para sincronización de evento
	function refetchEvent(): void {
		if (!userIdParams?.eventId) return;
		setIsSyncingEvent(true); // NUEVO
		getEventById(userIdParams.eventId)
			.then(res => setEvent(res))
			.catch(err => {
				console.error('Error refreshing event:', err);
			});
	}

	useEffect(() => {
		if (isSyncingEvent) {
			setIsSyncingEvent(false);
		}
	}, [event]);

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
					setPurchasesMade(res as IPurchaseReceipt[]);
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
				setcurrentUser(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});
	}, [user]);

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

	useEffect(() => {
		if (event?.state !== EventStatesEnum.AVAILABLE) return;
		isUserDebtor(user?.id as string).then((res: IsUserDebtorResponse) => {
			setUserDebtor(res.length > 0);
		});
	}, [event]);

	useEffect(() => {
		if (!event) return;
		if (!userIdParams?.eventId) return;
		if (![EventStatesEnum.READYFORPAYMENT, EventStatesEnum.FINISHED].includes(event.state as EventStatesEnum)) return;
		getMemberIndividualCost(userIdParams.eventId, user?.id as string)
			.then(res => setUserPrice(res.userAmount))
			.catch(err => {
				console.error('Error refreshing event:', err);
			});
	}, [event, user?.id, userIdParams.eventId]);

	useEffect(() => {
		if (!userIdParams?.eventId) return;

		const interval = setInterval(() => {
			if (document.visibilityState === 'visible') {
				refetchEvent();
			}
		}, 180000);

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				refetchEvent();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			clearInterval(interval);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	useEffect(() => {
		if (!modalSurvey || !userIdParams?.eventId) return;

		function deepEqual(obj1: any, obj2: any) {
			return JSON.stringify(obj1) === JSON.stringify(obj2);
		}

		const interval = setInterval(() => {
			if (document.visibilityState === 'visible') {
				getEventById(userIdParams.eventId)
					.then(res => {
						setEvent(prev => {
							if (deepEqual(prev, res)) return prev;
							return res;
						});
					})
					.catch(err => console.error('Error refreshing event:', err));
			}
		}, 3000);

		return () => clearInterval(interval);
	}, [modalSurvey, userIdParams?.eventId]);
	return (
		<PrivateFormLayout>
			<div className={styles.content} data-testid="event-content">
				<section className={styles.backBtnSection} onClick={handleGoToMain} data-testid="event-back-btn-section">
					<button className={styles.backBtn}></button>
					<p className={styles.backText}>{lang.backBtn}</p>
				</section>

				<section className={styles.header} data-testid="event-header"></section>
				{!!event && (
					<section className={styles.event} data-testid="event-main-section">
						<h1 className={styles.eventTitle} data-testid="event-title">
							{event.title}
						</h1>
						{isUserIntoEvent() &&
							(event.state === EventStatesEnum.CLOSED ||
								event.state === EventStatesEnum.READYFORPAYMENT ||
								event.state === EventStatesEnum.FINISHED) && (
								<Stars iconSize={25} count={5} defaultRating={0} icon={'★'} color="rgb(240, 191, 28)" idEvent={event._id}></Stars>
							)}

						{event.isPrivate && (
							<section className={styles.eventPrivate} data-testid="event-private-section">
								<div className={styles.privateLogo}></div>
								<p className={styles.privateDescription}>{lang.privateEvent}</p>
							</section>
						)}
						<main className={styles.eventData} data-testid="event-data-main">
							<div className={styles.eventOrganization} data-testid="event-organization">
								<section className={styles.eventBtns} data-testid="event-btns-section">
									{event.isPrivate && <button className={styles.copyLinkToEvent} onClick={() => copyLinkEvent()}></button>}
									{event.organizer?._id === user?.id && (
										<button className={styles.editEventBtn} onClick={() => editCurrentEvent()}></button>
									)}
								</section>

								<div className={styles.sectionTitle} data-testid="event-organization-title">
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

								{isUserIntoEvent() &&
									(event.state === EventStatesEnum.READYFORPAYMENT || event.state === EventStatesEnum.FINISHED) && (
										<h5 className={styles.infoData}>
											{lang.myEventPrice + ':'} {'$' + Math.round(userPrice)}
										</h5>
									)}

								<div className={styles.secondRow} data-testid="event-menu-row">
									<div className={styles.sectionTitle}>
										<div className={styles.restaurantLogo} />
										<h3 className={styles.logoTitle}>{lang.menu}</h3>
										{event.state === EventStatesEnum.AVAILABLE && isUserIntoEvent() && (
											<button className={styles.surveyEventBtn} onClick={openModalSurvey}></button>
										)}
									</div>
									<h5 className={styles.infoData}>{event.description}</h5>
								</div>

								<div className={styles.secondRow} data-testid="event-purchases-row">
									<div className={styles.sectionTitle}>
										<div className={styles.cartLogo}></div>
										<h3 className={styles.logoTitle}>{lang.purchasesMade}</h3>
										{event.state === EventStatesEnum.CLOSED && purchasesMade.length > 0 && (
											<button className={styles.assignEventBtn} onClick={openModalAssignation}></button>
										)}
									</div>
									{isUserIntoEvent() && (
										<section className={styles.purchasesList} data-testid="event-purchases-list">
											{purchasesMade.map((purchase: IPurchaseReceipt) => (
												<div key={purchase?._id} className={styles.purchasesRow} data-testid="event-purchase-row">
													<span>{purchase.description}</span>
													<span>{purchase.shoppingDesignee.name}</span>
													<span>{'$ ' + purchase.amount}</span>
													<span className={styles.actions} data-testid="event-purchase-actions">
														{event.shoppingDesignee?.some((d: IUser) => d._id === user?.id) &&
															event.state !== EventStatesEnum.AVAILABLE &&
															event.state !== EventStatesEnum.READYFORPAYMENT && (
																<button
																	className={styles.deleteBtn}
																	onClick={e => {
																		e.preventDefault();
																		deletePurchase(purchase);
																	}}></button>
															)}
														<button
															className={styles.previewBtn}
															onClick={e => {
																e.preventDefault();
																PreviewPurchase(purchase);
															}}></button>
													</span>
												</div>
											))}
										</section>
									)}
								</div>
							</div>
							<div className={styles.eventParticipants} data-testid="event-participants-section">
								<div className={styles.sectionTitle}>
									<div className={styles.inChargeLogo}></div>
									<h3 className={styles.logoTitle}>{lang.inchargeTitle}</h3>
								</div>

								<div className={styles.responsibilitiesSection} data-testid="event-responsibilities-section">
									<div className={styles.inChargeOpt} data-testid="event-chef-section">
										<div className={styles.chefDesigneeSection}>
											<h5 className={styles.infoData}>
												{lang.cook}
												{event.chef ? (event.chef?._id === user?.id ? lang.me : event.chef.name) : lang.empty}
											</h5>
											<div className={styles.assignTransitionWrapper} data-testid="event-chef-assign-wrapper">
												{event.chef &&
													event.chef?._id === user?.id &&
													event.state === EventStatesEnum.AVAILABLE &&
													isUserIntoEvent() && (
														<AssignBtn
															key={`unassign-${user?.id}`}
															kind="unAssign"
															disabled={isLoading || isSyncingEvent}
															style={isLoading || isSyncingEvent ? { opacity: 0.5 } : {}}
															onClick={() => toogleChef()}></AssignBtn>
													)}

												{!event.chef && event.state === EventStatesEnum.AVAILABLE && isUserIntoEvent() && (
													<AssignBtn
														key={`assign-${user?.id}`}
														kind="assign"
														style={isLoading || isSyncingEvent ? { opacity: 0.5 } : {}}
														disabled={isLoading || isSyncingEvent}
														onClick={() => toogleChef()}></AssignBtn>
												)}
											</div>
										</div>
									</div>
									<div className={styles.inChargeOpt} data-testid="event-shopdesignee-section">
										<div className={styles.shoppingDesigneeDescSection}>
											<h5 className={styles.infoData}>
												{lang.buyer}{' '}
												{event.shoppingDesignee.length === 0
													? lang.empty
													: isUserShoppingDesignee() || !isUserIntoEvent()
													? lang.assignedOpt
													: event.state === EventStatesEnum.AVAILABLE && lang.addmeOpt}
											</h5>

											<div className={styles.assignTransitionWrapper} data-testid="event-shopdesignee-assign-wrapper">
												{!event.shoppingDesignee.length && event.state === EventStatesEnum.AVAILABLE && isUserIntoEvent() && (
													<AssignBtn
														key="assign"
														kind="assign"
														style={isLoading || isSyncingEvent ? { opacity: 0.5 } : {}}
														disabled={isLoading || isSyncingEvent}
														onClick={() => toogleShopDesignee()}></AssignBtn>
												)}
												{Boolean(
													event.shoppingDesignee.length &&
														event.state === EventStatesEnum.AVAILABLE &&
														isUserIntoEvent() &&
														event.shoppingDesignee.find(sd => sd._id === user?.id)
												) && (
													<AssignBtn
														key="unassign"
														kind="unAssign"
														style={isLoading || isSyncingEvent ? { opacity: 0.5 } : {}}
														disabled={isLoading || isSyncingEvent}
														onClick={() => toogleShopDesignee()}></AssignBtn>
												)}
												{event.shoppingDesignee.length > 0 &&
													event.state === EventStatesEnum.AVAILABLE &&
													isUserIntoEvent() &&
													!event.shoppingDesignee.some((d: IUser) => d._id === user?.id) && (
														<AssignBtn
															key="add"
															kind="add"
															style={isLoading || isSyncingEvent ? { opacity: 0.5 } : {}}
															disabled={isLoading || isSyncingEvent}
															onClick={() => toogleShopDesignee()}></AssignBtn>
													)}
											</div>
										</div>
										<div className={styles.shoppingDesigneeSection} data-testid="event-shopdesignee-list">
											{event.shoppingDesignee.length
												? event.shoppingDesignee.map((designee: IUser, i: number) => (
														<div
															key={designee._id}
															className={styles.singleDesigneeSection}
															data-testid="event-shopdesignee-item">
															<h5>{designee._id === user?.id ? lang.meOpt : designee.name}</h5>
														</div>
												  ))
												: ''}
										</div>
									</div>
								</div>

								<div className={styles.secondRow} data-testid="event-participants-row">
									<div className={styles.participantsTitle}></div>

									<div className={styles.sectionTitle}>
										<div className={styles.participantsLogo} />
										<h3 className={styles.logoTitle}>
											{lang.diners} {event.members.length}/{event.memberLimit}
										</h3>
									</div>

									<section className={styles.infoParticipants} data-testid="event-participants-list">
										{eventParticipants.map((member: EventUserResponse, i: number) => (
											<div key={`participants-key-${i}`} className={styles.infoData} data-testid="event-participant-item">
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
													(member.hasReceiptApproved || currentUserHasNoDebts(member) ? (
														<h5 className={styles.infoDataUsernamePayed}>{lang.paidNoti}</h5>
													) : member.hasUploaded ? (
														currentUserPaysHasToPayMe(member) ? (
															<Button
																className={styles.btnEvent}
																kind="validation"
																size="micro"
																onClick={() => {
																	setTransferReceiptId(member.transferReceipt as string);
																	setUserToApprove(member.userId);
																	openValidationPopup();
																}}
																disabled={isLoading || isSyncingEvent}>
																{lang.validateBtn}
															</Button>
														) : (
															<h5 className={styles.waitingValidationPay}>{lang.awaitingNoti}</h5>
														)
													) : (
														<>
															<h5 className={styles.infoDataUsernameDidntPay}>{lang.pendingNoti}</h5>
															{currentUserPaysHasToPayMe(member) && (
																<button
																	className={styles.fastAproveBtn}
																	onClick={e => {
																		e.preventDefault();
																		openModalFastAproval(member.userId);
																	}}
																	disabled={isLoading || isSyncingEvent}></button>
															)}
														</>
													))}
											</div>
										))}
									</section>
								</div>
							</div>
						</main>
						<section className={styles.btnSection} data-testid="event-main-btn-section">
							{event.state === EventStatesEnum.AVAILABLE && !isLoading && (
								<div data-testid="event-participation-btn-wrapper">
									{!isUserIntoEvent() && isEventFull() ? (
										<Button className={styles.btnEvent} kind="tertiary" size="short" disabled>
											{EventStatesEnum.FULL}
										</Button>
									) : (
										<Button
											className={styles.btnEvent}
											kind="secondary"
											size="short"
											onClick={() => toogleParticipation()}
											disabled={isLoading || isSyncingEvent}>
											{isUserIntoEvent() ? lang.getOff : !isEventFull() && lang.getInto}
										</Button>
									)}
								</div>
							)}
							{event.organizer && event.organizer?._id === user?.id && (
								<Button
									className={styles.btnEvent}
									kind="secondary"
									size="short"
									onClick={() => deleteTheEvent()}
									disabled={isLoading || isSyncingEvent}>
									{lang.deleteEventBtn}
								</Button>
							)}
							{event.organizer &&
								isUserIntoEvent() &&
								(event.organizer?._id === user?.id || event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) &&
								event.state !== 'finished' &&
								event.state !== EventStatesEnum.READYFORPAYMENT &&
								event.state !== EventStatesEnum.AVAILABLE &&
								event.purchaseReceipts.length > 0 && (
									<Button
										className={styles.btnEvent}
										kind="secondary"
										size="short"
										onClick={() => setEventToReadyForPay()}
										disabled={isLoading || isSyncingEvent}>
										{lang.readyForPaymentBtn}
									</Button>
								)}
							{event.organizer &&
								isUserIntoEvent() &&
								(event.organizer?._id === user?.id || event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) &&
								event.state !== 'finished' &&
								event.state !== EventStatesEnum.CLOSED && (
									<Button
										className={styles.btnEvent}
										kind="secondary"
										size="short"
										onClick={() => closeEvent()}
										disabled={isLoading || isSyncingEvent}>
										{lang.closeEventBtn}
									</Button>
								)}
							{event.organizer &&
								isUserIntoEvent() &&
								(event.organizer?._id === user?.id || event.shoppingDesignee.some((d: IUser) => d._id === user?.id)) &&
								event.state === EventStatesEnum.CLOSED && (
									<Button
										className={styles.btnEvent}
										kind="secondary"
										size="short"
										onClick={() => reopenEvent()}
										disabled={isLoading || isSyncingEvent}>
										{lang.reopenEventBtn}
									</Button>
								)}
							{event.shoppingDesignee &&
								event.state === EventStatesEnum.READYFORPAYMENT &&
								isUserIntoEvent() &&
								paymentInfo.amount !== 0 &&
								(event.purchaseReceipts.length as number) !== 0 &&
								(!checkIfUserHasUploaded() ? (
									<Button
										className={styles.btnEvent}
										kind="primary"
										size="short"
										onClick={() => payCheck()}
										disabled={isLoading || isSyncingEvent}>
										{lang.payBtn}
									</Button>
								) : (
									!checkIfUserHasPaid() && (
										<Button
											className={styles.btnEvent}
											kind="secondary"
											size="short"
											onClick={() => payCheck()}
											disabled={isLoading || isSyncingEvent}>
											{lang.modifyPay}
										</Button>
									)
								))}
							{event.shoppingDesignee &&
								event.shoppingDesignee.some((d: IUser) => d._id === user?.id) &&
								event.state === EventStatesEnum.CLOSED && (
									<Button
										className={styles.btnEvent}
										kind="primary"
										size="short"
										onClick={() => openModalPurchaseRecipt()}
										disabled={isLoading || isSyncingEvent}>
										{lang.loadPurchase}
									</Button>
								)}
						</section>
					</section>
				)}
			</div>

			{event && (
				<Modal isOpen={modalPaycheckState} closeModal={closeModal} data-testid="event-modal-paycheck">
					<PayCheckForm
						event={event}
						shoppingDesignee={paymentInfo.receiver}
						amount={paymentInfo.amount}
						openModal={openModal}
						closeModal={() => {
							closeModal();
							refetchEvent();
						}}
					/>
				</Modal>
			)}

			{event && (
				<Modal isOpen={modalPurchaseRecipt} closeModal={closeModalPurchaseRecipt} data-testid="event-modal-purchase-receipt">
					<PurchaseReceiptForm
						event={event}
						openModal={openModalPurchaseRecipt}
						closeModal={() => {
							closeModalPurchaseRecipt();
							refetchEvent();
						}}></PurchaseReceiptForm>
				</Modal>
			)}

			{event && (
				<Modal isOpen={modalValidationState} closeModal={closeValidationPopup} data-testid="event-modal-validation">
					<ConfirmationPayForm
						event={event}
						userToApprove={userToApprove}
						transferReceiptId={transferReceiptId}
						openModal={() => openValidationPopup}
						closeModal={() => {
							closeValidationPopup();
							refetchEvent();
						}}
					/>
				</Modal>
			)}

			<Modal isOpen={modalFastAproval} closeModal={closeModalFastAproval} data-testid="event-modal-fast-approval">
				<ConfirmationFastAprovalForm
					eventId={userIdParams.eventId as string}
					userId={userToFastAprove}
					closeModal={() => {
						closeModalFastAproval();
						refetchEvent();
					}}></ConfirmationFastAprovalForm>
			</Modal>

			{event && user && (
				<Modal isOpen={modalSurvey} closeModal={closeModalSurvey} data-testid="event-modal-survey">
					<FoodSurvey
						eventId={event._id}
						userId={user.id}
						open={modalSurvey}
						canUserEdit={event.organizer._id === user.id || !!isUserShoppingDesignee()}
						options={event.options as IOption[]}
						participantsCount={event.members.length}
						onOptionsChange={opts => setEvent((e: any) => ({ ...e, options: opts }))}
					/>
				</Modal>
			)}

			<Modal isOpen={modalAssignation} closeModal={closeModalAssignation} data-testid="event-modal-assignation">
				<AssignationTable
					eventId={userIdParams.eventId as string}
					userId={currentUser?._id as string}
					closeModal={() => {
						closeModalAssignation();
						refetchEvent();
					}}></AssignationTable>
			</Modal>
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
					data-testid="event-files-preview"
				/>
			)}
		</PrivateFormLayout>
	);
}
