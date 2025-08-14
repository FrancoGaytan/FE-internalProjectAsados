import { TEventState, TEventParticipationState } from '../../../types/eventState';
import Button from '../../micro/Button/Button';
import { className } from '../../../utils/className';
import { EventStatesEnum } from '../../../enums/EventState.enum';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useNavigate } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import { getEventById, getMembersAndReceiptsInfo, subscribeToAnEvent } from '../../../service/eventService';
import { useAlert } from '../../../stores/AlertContext';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { EventByIdResponse, IEvent } from '../../../models/event';
import EventHeader from './EventHeader/EventHeader';
import { useAuth } from '../../../stores/AuthContext';
import { parseMinutes } from '../../../utils/utilities';
import styles from './styles.module.scss';
import { event } from '../../../localization/en-us/event';
import Tooltip from '../../micro/Tooltip/Tooltip';
import StarRating from '../../micro/starRating/starRating';
import { EventUserResponse, IUser } from '../../../models/user';

interface IEventData {
	eventTitle: String;
	eventDescription: String;
	eventParticipants: Number;
	eventShoppingDesignees: IUser[];
	eventParticipantLimit: Number;
	eventCook: String;
	eventAvgRate: number;
	eventRatingsAmount: number;
}

interface IEventCardProps {
	eventId: string;
	eventState: TEventState;
	eventUserIsDebtor: string[];
	eventDateTime: Date;
	eventData: IEventData;
	userId: string | undefined;
}

export default function EventCard(props: IEventCardProps): JSX.Element {
	const lang = useTranslation('eventHome');
	const [privateEvent, setPrivateEvent] = useState<EventByIdResponse>();
	const navigate = useNavigate();
	const { setAlert } = useAlert();
	const { user } = useAuth();
	const evState = props.eventState;
	const evDateTime = new Date(props.eventDateTime);
	const evTitle = props.eventData.eventTitle;
	const evDescription = props.eventData.eventDescription;
	const evParticipants = props.eventData.eventParticipants;
	const evParticipantsLimit = props.eventData.eventParticipantLimit;
	const evCook = props.eventData.eventCook;
	const evShoppingDesignees = props.eventData.eventShoppingDesignees;
	const evId = props.eventId;
	const evUserIsDebtor = props.eventUserIsDebtor;
	const evRatingsAmount = props.eventData.eventRatingsAmount;
	const evAvgRate = props.eventData.eventAvgRate;
	const evDate = evDateTime.getDate().toString() + '. ' + String(evDateTime.getMonth() + 1) + '. ' + evDateTime.getFullYear().toString() + '.';
	const evTime = (evDateTime.getHours() + 3).toString() + ':' + parseMinutes(evDateTime.getMinutes().toString());
	const eventParticipationState: TEventParticipationState = calculateAvailability() ? EventStatesEnum.INCOMPLETED : EventStatesEnum.FULL;
	const [eventParticipants, setEventParticipants] = useState<EventUserResponse[]>([]);

	function handleInfo() {
		if (!!user?.name) {
			navigate(`/event/${evId}`);
		} else {
			setAlert(lang.noLoggedMsg, AlertTypes.ERROR);
		}
	}

	function subscribeUserToEvent(): void {
		if (!user) return;

		subscribeToAnEvent(user?.id as string, evId)
			.then(res => {
				navigate(`/event/${evId}`);
				setAlert(`${lang.userAddedSuccessfully}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.userAddingFailure}`, AlertTypes.ERROR));
	}

	function checkIfUserHasPaid() {
		if (eventParticipants.length === 0) {
			return false;
		}
		const myReceipt = eventParticipants.find(member => member.userId === user?.id);
		return myReceipt?.hasReceiptApproved;
	}

	function checkIfUserIsIntoTheEvent() {
		if (eventParticipants.length === 0) {
			return false;
		}
		return eventParticipants.find(member => member.userId === user?.id);
	}

	function handleParticipation() {
		if (!!user?.name) {
			subscribeUserToEvent();
		} else {
			setAlert(lang.noLoggedMsgParticipate, AlertTypes.ERROR);
		}
	}

	function calculateAvailability() {
		let availability = Number(evParticipantsLimit) - Number(evParticipants);
		return availability > 0;
	}

	function verifySubscription(): boolean {
		return !!privateEvent?.members.find(member => (member?._id as unknown) === props.userId);
	}

	function isAnotherEventBlocking(): boolean {
		if (!user?.id) {
			return false;
		}
		if (evUserIsDebtor.length > 0) {
			if (!evUserIsDebtor.includes(evId) && !evShoppingDesignees.some(designee => designee._id === user.id)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	function isThisEventBlocking(): boolean {
		if (evUserIsDebtor.length > 0) {
			if (evUserIsDebtor.includes(evId)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	useEffect(() => {
		getEventById(evId)
			.then(res => {
				setPrivateEvent(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		verifySubscription();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [privateEvent]);

	useEffect(() => {
		if (!evId) {
			return;
		}
		const abortController = new AbortController();
		getMembersAndReceiptsInfo(evId, abortController.signal)
			.then(res => {
				setEventParticipants(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});
	}, [evId]);

	return (
		//la clase cardContainer tiene que ir acompañado con una clase que represente al estado del evento que trae por props
		<div {...className(styles.cardContainer)}>
			<EventHeader
				evState={evState}
				isEventBlocking={isThisEventBlocking()}
				isAnotherEventBlocking={isAnotherEventBlocking()}
				evParticipants={evParticipants}
				evParticipantsLimit={evParticipantsLimit}
				evDate={evDate}
				userHasPaid={!!checkIfUserHasPaid()}
				userIntoTheEvent={!!checkIfUserIsIntoTheEvent()}
				subscribedUser={verifySubscription()}
			/>

			<section className={styles.cardMainInfo}>
				<section className={styles.cardMainData}>
					<div className={styles.eventTime}>{evTime} hrs</div>
					<section className={styles.mainInfo}>
						<div className={styles.eventTitle}>{evTitle}</div>
						{privateEvent?.isPrivate && (
							<Tooltip infoText={lang.privateEvent}>
								<div className={styles.privateLogo}></div>
							</Tooltip>
						)}
					</section>

					<div className={styles.eventDescription}>{evDescription}</div>

					<div className={styles.eventParticipants}>
						{lang.currentParticipants}
						<p>
							{evParticipants.toString()}/{evParticipantsLimit.toString()}
						</p>
					</div>

					<div className={styles.eventCook}>
						{lang.cook} <p>{evCook}</p>
					</div>
				</section>

				<section className={styles.cardBtn}>
					<div className={styles.participateBtn}>
						{!verifySubscription() &&
							!isAnotherEventBlocking() &&
							evState === EventStatesEnum.AVAILABLE &&
							eventParticipationState === EventStatesEnum.INCOMPLETED &&
							!!user?.name && (
								<Button
									kind="secondary"
									size="small"
									id="infoBtn"
									style={{ marginBottom: '10vh' }}
									onClick={e => {
										//e.preventDefault();
										handleParticipation();
									}}>
									{lang.participateBtn}
								</Button>
							)}
					</div>
					{(evState === EventStatesEnum.FINISHED || evState === EventStatesEnum.READYFORPAYMENT || evState === EventStatesEnum.CLOSED) && (
						<section className={styles.ratingSection}>
							<StarRating rating={evAvgRate} />
							{evRatingsAmount > 0 && <p className={styles.ratingAvg}>{Number(evAvgRate).toFixed(1)}</p>}

							{evRatingsAmount === 1 ? (
								<p className={styles.ratingRatingsAmoung}>
									{'('}
									{evRatingsAmount} {lang.reviewText}
									{')'}
								</p>
							) : (
								<p className={styles.ratingRatingsAmoung}>
									{'('}
									{evRatingsAmount} {lang.reviewTexts}
									{')'}
								</p>
							)}
						</section>
					)}

					<div className={styles.infoBtn}>
						<Button
							kind={isAnotherEventBlocking() ? 'tertiary' : 'secondary'}
							size="small"
							id="infoBtn"
							style={{ marginBottom: '10vh' }}
							onClick={e => {
								if (!isAnotherEventBlocking()) {
									e.preventDefault();
									handleInfo();
								}
							}}>
							{lang.infoBtn}
						</Button>
					</div>
				</section>
			</section>
		</div>
	);
}
