import { TEventState, TEventParticipationState } from '../../../types/eventState';
import Button from '../../micro/Button/Button';
import { className } from '../../../utils/className';
import { EventStatesEnum } from '../../../enums/EventState.enum';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEventById, subscribeToAnEvent } from '../../../service/eventService';
import { useAlert } from '../../../stores/AlertContext';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { IEvent } from '../../../models/event';
import EventHeader from './EventHeader/EventHeader';
import { useAuth } from '../../../stores/AuthContext';
import { parseMinutes } from '../../../utils/utilities';
import styles from './styles.module.scss';

interface IEventData {
	eventTitle: String;
	eventDescription: String;
	eventParticipants: Number;
	eventParticipantLimit: Number;
	eventCook: String;
}

interface IEventCardProps {
	eventId: string; //esto es nuevo, necesito saber si me la trae o no
	eventState: TEventState;
	eventDateTime: Date;
	eventData: IEventData;
	userId: string | undefined;
}

export default function EventCard(props: IEventCardProps): JSX.Element {
	const lang = useTranslation('eventHome');
	const [privateEvent, setPrivateEvent] = useState<IEvent>();
	const navigate = useNavigate();
	const { setAlert } = useAlert();
	const { user } = useAuth();

	const evState = props.eventState; //esta prop va a ser para darle el estilo a la card
	const evDateTime = new Date(props.eventDateTime); //esto va a haber que pasarlo x una funcion que seccione la fecha y la hora y despues separarlos en dos variables diferentes
	const evTitle = props.eventData.eventTitle;
	const evDescription = props.eventData.eventDescription;
	const evParticipants = props.eventData.eventParticipants;
	const evParticipantsLimit = props.eventData.eventParticipantLimit;
	const evCook = props.eventData.eventCook;
	const evId = props.eventId;

	const evDate = evDateTime.getDate().toString() + '. ' + String(evDateTime.getMonth() + 1) + '. ' + evDateTime.getFullYear().toString() + '.';
	const evTime = evDateTime.getHours().toString() + ':' + parseMinutes(evDateTime.getMinutes().toString());
	const eventParticipationState: TEventParticipationState = calculateAvailability() ? EventStatesEnum.INCOMPLETED : EventStatesEnum.FULL;

	function handleInfo() {
		if (!!user?.name) {
			navigate(`/event/${evId}`);
		} else {
			setAlert(lang.noLoggedMsg, AlertTypes.ERROR);
		}
	}

	function subscribeUserToEvent(): void {
		if (!user) {
			return;
		}
		subscribeToAnEvent(user?.id as string, evId)
			.then(res => {
				setAlert(`${lang.userAddedSuccessfully}!`, AlertTypes.SUCCESS);
			})
			.catch(e => setAlert(`${lang.userAddingFailure}`, AlertTypes.ERROR));
	}

	function handleParticipation() {
		if (!!user?.name) {
			subscribeUserToEvent();
			navigate(`/event/${evId}`);
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

	useEffect(() => {
		getEventById(evId)
			.then(res => {
				setPrivateEvent(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
				//setAlert(`${lang.needsLogin}!`, AlertTypes.ERROR);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		verifySubscription();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [privateEvent]);

	return (
		//la clase cardContainer tiene que ir acompañado con una clase que represente al estado del evento que trae por props
		<div {...className(styles.cardContainer)}>
			<EventHeader
				evState={evState}
				evParticipants={evParticipants}
				evParticipantsLimit={evParticipantsLimit}
				evDate={evDate}
				subscribedUser={verifySubscription()}
			/>

			<section className={styles.cardMainInfo}>
				<div className={styles.eventTime}>{evTime} hrs</div>

				<div className={styles.eventTitle}>{evTitle}</div>

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

				<section className={styles.cardBtn}>
					<div className={styles.participateBtn}>
						{!verifySubscription() &&
							evState === EventStatesEnum.AVAILABLE &&
							eventParticipationState === EventStatesEnum.INCOMPLETED &&
							!!user?.name && (
								<Button
									kind="secondary"
									size="small"
									id="infoBtn"
									style={{ marginBottom: '10vh' }}
									onClick={e => {
										e.preventDefault();
										handleParticipation();
									}}>
									{lang.participateBtn}
								</Button>
							)}
					</div>

					<div className={styles.infoBtn}>
						<Button
							kind="secondary"
							size="small"
							id="infoBtn"
							style={{ marginBottom: '10vh' }}
							onClick={e => {
								e.preventDefault();
								handleInfo();
							}}>
							{lang.infoBtn}
						</Button>
					</div>
				</section>
			</section>
		</div>
	);
}
