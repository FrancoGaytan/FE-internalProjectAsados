import React from 'react';
import { TEventState, TSubscribedState, TEventParticipationState } from '../../../types/eventState';
import styles from './styles.module.scss';
import Button from '../../micro/Button/Button';
import { className } from '../../../utils/className';
import { useState, useEffect } from 'react';
import { EventStatesEnum } from '../../../enums/EventState.enum';
import { useTranslation } from '../../../stores/LocalizationContext';

interface IEventData {
	eventTitle: String;
	eventDescription: String;
	eventParticipants: Number;
	eventParticipantLimit: Number;
	eventCook: String;
}

interface IEventCardProps {
	eventState: TEventState;
	eventDateTime: Date;
	eventData: IEventData;
}

const EventCard = (props: IEventCardProps) => {
	const lang = useTranslation('eventHome');

	const evState = props.eventState; //esta prop va a ser para darle el estilo a la card
	const evDateTime = props.eventDateTime; //esto va a haber que pasarlo x una funcion que seccione la fecha y la hora y despues separarlos en dos variables diferentes
	const evTitle = props.eventData.eventTitle;
	const evDescription = props.eventData.eventDescription;
	const evParticipants = props.eventData.eventParticipants;
	const evParticipantsLimit = props.eventData.eventParticipantLimit;
	const evCook = props.eventData.eventCook;

	const evDate = evDateTime.getDate().toString() + '. ' + evDateTime.getMonth().toString() + '. ' + evDateTime.getFullYear().toString() + '.';
	const evTime = evDateTime.getHours().toString() + ':' + evDateTime.getMinutes().toString();

	const handleInfo = () => {};

	const handleParticipation = () => {};

	const calculateAvailability = () => {
		let availability = Number(evParticipantsLimit) - Number(evParticipants);
		return availability > 0;
	};

	const verifySubscription = () => {
		//todo: esta funcion va a chequear en el back si el usuario esta subscripto a un evento o no, esta funcion quizas debería importarse de otro archivo
		//x ahora le pongo una comparacion muy obvia
		return false; //esto tiene qe retornar si esta subscripto o no
	};

	let eventParticipationState: TEventParticipationState = calculateAvailability() ? EventStatesEnum.Incompleted : EventStatesEnum.Full;
	let subscribedUser: TSubscribedState = verifySubscription() ? 'subscribed' : 'not-subscribed'; // de aca tiene que obtener con una funcion si el usuario esta anotado o no al evento

	const verifyState = () => {
		if (subscribedUser === 'subscribed' && evState !== EventStatesEnum.Canceled) {
			return 'subscribed';
		} else if (eventParticipationState === EventStatesEnum.Full) {
			return EventStatesEnum.Full;
		} else {
			return evState;
		}
	};

	let eventDescription = verifyState();

	return (
		//la clase cardContainer tiene que ir acompañado con una clase que represente al estado del evento que trae por props
		<div
			{...className(
				styles.cardContainer, //aca es importante el orden, si es que no condiciono las clases
				styles[evState ?? EventStatesEnum.Available],
				styles[evState ?? EventStatesEnum.Canceled],
				styles[eventParticipationState ?? EventStatesEnum.Full],
				styles[subscribedUser ?? 'subscribed'],
				styles[evState ?? EventStatesEnum.Closed] //decidir bien que se va a mostrar si se esta suscripto y el evento se cierra
			)}>
			<section className={styles.cardTitleInfo}>
				<div className={styles.availabilityDesc}>{eventDescription.toUpperCase()}</div>
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
						{evState === EventStatesEnum.Available &&
							eventParticipationState === EventStatesEnum.Incompleted &&
							subscribedUser !== 'subscribed' && (
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
