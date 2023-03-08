import React from 'react';
import { TEventState } from '../../../types/eventState';
import styles from './styles.module.scss';
import Button from '../../micro/Button/Button';
import { className } from '../../../utils/className';

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

	return (
		//la clase cardContainer tiene que ir acompañado con una clase que represente al estado del evento que trae por props
		<div
			{...className(
				styles.cardContainer,
				styles[evState ?? 'available'],
				styles[evState ?? 'canceled'],
				styles[evState ?? 'closed'],
				styles[evState ?? 'completed']
			)}>
			<section className={styles.cardTitleInfo}>
				<div className={styles.availabilityDesc}>DISPONIBLE</div>
				{/* x ahora se lo hardcodeo */}
				<div className={styles.eventCardDate}>{evDate.toString()}</div>
				{/* x ahora se lo hardcodeo */}
			</section>
			<section className={styles.cardMainInfo}>
				<div className={styles.eventTime}>{evTime} hrs</div>
				{/* x ahora se lo hardcodeo */}
				<div className={styles.eventTitle}>{evTitle}</div>
				<div className={styles.eventDescription}>{evDescription}</div>
				<div className={styles.eventParticipants}>
					Participantes actuales:{' '}
					<p>
						{evParticipants.toString()}/{evParticipantsLimit.toString()}
					</p>
				</div>
				<div className={styles.eventCook}>
					Asador: <p>{evCook}</p>
				</div>
			</section>
			<section className={styles.infoBtn}>
				<Button
					kind="secondary"
					size="small"
					id="infoBtn"
					style={{ marginBottom: '10vh' }}
					onClick={e => {
						e.preventDefault();
						handleInfo();
					}}>
					INFO
				</Button>
			</section>
		</div>
	);
};

export default EventCard;
