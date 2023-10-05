import { useMemo, useState, useEffect } from 'react';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import { useEvent } from '../../stores/EventContext';
import { useAuth } from '../../stores/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getEventById, subscribeToAnEvent, unsubscribeToAnEvent } from '../../service';
import { useParams } from 'react-router-dom';
import { IUser } from '../../models/user';
import AssignBtn from '../../components/micro/AssignBtn/AssignBtn';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { getUserById, editRoles, deleteEvent, editEvent } from '../../service';

export function Event(): JSX.Element {
	const lang = useTranslation('eventHome');
	const { user } = useAuth();
	const navigate = useNavigate();
	const { setAlert } = useAlert();
	const [event, setEvent] = useState<any>(); //TODO: Sacar o typear este any
	const [actualUser, setActualUser] = useState<IUser>();
	const userIdParams = useParams();

	const itemStepsData = useMemo(
		//TODO: fijate si a esto lo tenes que usar en algun lado, sino volalo
		() => [
			{ title: lang.LogInTheApp.title, description: lang.LogInTheApp.description, imagePath: '/assets/pictures/joinAppLogo.png' },
			{ title: lang.joinToAnBarbecue.title, description: lang.joinToAnBarbecue.description, imagePath: '/assets/pictures/calendarLogo.png' },
			{ title: lang.letsEat.title, description: lang.letsEat.description, imagePath: '/assets/pictures/chickenLeg.png' }
		],
		[lang]
	);

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
		alert('estas pagando');
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
		getUserById(user?.id, abortController.signal)
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

	console.log(event);

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
								(event.purchaseReceipts.length as number) === 0 && (
									<Button className={styles.btnEvent} kind="tertiary" size="short">
										{lang.payBtn}
									</Button>
								)}
							{event.shoppingDesignee &&
								event.shoppingDesignee._id !== user?.id &&
								event.state === 'closed' &&
								(event.purchaseReceipts.length as number) > 0 && (
									<Button className={styles.btnEvent} kind="primary" size="short" onClick={() => payCheck()}>
										{lang.payBtn}
									</Button>
								)}
						</section>
					</section>
				)}
			</div>
		</PrivateFormLayout>
	);
}
