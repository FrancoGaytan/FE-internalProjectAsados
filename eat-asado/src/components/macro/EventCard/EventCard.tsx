import { TEventState, TSubscribedState, TEventParticipationState } from '../../../types/eventState';
import Button from '../../micro/Button/Button';
import { className } from '../../../utils/className';
import { EventStatesEnum } from '../../../enums/EventState.enum';
import { useTranslation } from '../../../stores/LocalizationContext';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEventById } from '../../../service/eventService';
import { useAlert } from '../../../stores/AlertContext';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { IEvent } from '../../../models/event';

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

const EventCard = (props: IEventCardProps): any => {
	const lang = useTranslation('eventHome');
	const [privateEvent, setPrivateEvent] = useState<IEvent>();
	const navigate = useNavigate();
	const { setAlert } = useAlert();

	function parseMinutes(minutes: string) {
		let newMinutes = minutes;
		if (Number(minutes) < 10) {
			newMinutes = '0' + minutes;
		}
		return newMinutes;
	}

	const evState = props.eventState; //esta prop va a ser para darle el estilo a la card
	const evDateTime = new Date(props.eventDateTime); //esto va a haber que pasarlo x una funcion que seccione la fecha y la hora y despues separarlos en dos variables diferentes
	const evTitle = props.eventData.eventTitle;
	const evDescription = props.eventData.eventDescription;
	const evParticipants = props.eventData.eventParticipants;
	const evParticipantsLimit = props.eventData.eventParticipantLimit;
	const evCook = props.eventData.eventCook;
	const evId = props.eventId;

	const evDate = evDateTime.getDate().toString() + '. ' + evDateTime.getMonth().toString() + '. ' + evDateTime.getFullYear().toString() + '.';
	const evTime = evDateTime.getHours().toString() + ':' + parseMinutes(evDateTime.getMinutes().toString());

	const handleInfo = () => {
		navigate(`/event/${evId}`);
		window.location.reload(); //TODO esto lo estoy poniendo solo para que actualize el jwt, fijate con maxi como se puede actualizar tan pronto te logeas, o al menos saber xq esta pasando eso en las request
	};

	const handleParticipation = () => {
		navigate(`/event/${evId}`);
		window.location.reload(); //TODO esto lo estoy poniendo solo para que actualize el jwt, fijate con maxi como se puede actualizar tan pronto te logeas, o al menos saber xq esta pasando eso en las request
		//TODO: Agregar la inscripcion del usuario al evento
	};

	const calculateAvailability = () => {
		let availability = Number(evParticipantsLimit) - Number(evParticipants);
		return availability > 0;
	};

	function verifySubscription(): boolean {
		console.log(privateEvent?.members);
		console.log(props.userId);
		return !!privateEvent?.members.find(member => (member?._id as unknown) === props.userId);
		//return false; /* privateEvent?.members.find(part: { _id: string }) => part._id === userId  */
	}

	function parseDateToCompare(date: Date) {
		return (
			`${date.getFullYear().toString()}` +
			`${date.getMonth().toString().length > 1 ? date.getMonth().toString() : `0${date.getMonth().toString()}`}` +
			`${date.getDate().toString().length > 1 ? date.getDate().toString() : `0${date.getDate().toString()}`}`
		);
	}

	let eventParticipationState: TEventParticipationState = calculateAvailability() ? EventStatesEnum.INCOMPLETED : EventStatesEnum.FULL;
	let subscribedUser: TSubscribedState = verifySubscription() ? 'subscribed' : 'not-subscribed'; // de aca tiene que obtener con una funcion si el usuario esta anotado o no al evento

	const verifyState = () => {
		console.log(parseDateToCompare(evDateTime));
		console.log(parseDateToCompare(new Date('Nov 02 2023')));
		console.log(parseDateToCompare(evDateTime) < parseDateToCompare(new Date()));
		if (parseDateToCompare(evDateTime) < parseDateToCompare(new Date())) {
			return EventStatesEnum.CLOSED;
		} else if (subscribedUser === 'subscribed' && evState !== EventStatesEnum.CANCELED) {
			return 'subscribed';
		} else if (eventParticipationState === EventStatesEnum.FULL) {
			return EventStatesEnum.FULL;
		} else return EventStatesEnum.AVAILABLE;
	};

	let eventDescription = verifyState();

	useEffect(() => {
		const abortController = new AbortController();
		getEventById(evId, abortController.signal)
			.then(res => {
				setPrivateEvent(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
				setAlert(`${lang.needsLogin}!`, AlertTypes.ERROR);
			});

		return () => abortController.abort();
	}, []);

	useEffect(() => {
		verifySubscription();
	}, [privateEvent]);

	return (
		//la clase cardContainer tiene que ir acompañado con una clase que represente al estado del evento que trae por props
		<div
			{...className(
				styles.cardContainer, //aca es importante el orden, si es que no condiciono las clases
				styles[evState ?? EventStatesEnum.AVAILABLE],
				styles[evState ?? EventStatesEnum.CANCELED],
				styles[eventParticipationState ?? EventStatesEnum.FULL],
				styles[subscribedUser ?? 'subscribed'],
				styles[evState ?? EventStatesEnum.CLOSED] //decidir bien que se va a mostrar si se esta suscripto y el evento se cierra
			)}>
			<section className={styles.cardTitleInfo}>
				<div className={styles.availabilityDesc}>{eventDescription?.toUpperCase()}</div>
				{/* todo: buscar la manera de incluir el lang para traducir el estado de evento */}

				<div className={styles.eventCardDate}>{evDate.toString()}</div>
			</section>
			<section className={styles.cardMainInfo}>
				<div className={styles.eventTime}>{evTime} hrs</div>
				<div className={styles.eventTitle}>{evTitle}</div>
				<div className={styles.eventDescription}>{evDescription}</div>
				<div className={styles.eventParticipants}>
					{lang.actualParticipants}
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
							eventParticipationState === EventStatesEnum.INCOMPLETED && (
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
};

export default EventCard;
