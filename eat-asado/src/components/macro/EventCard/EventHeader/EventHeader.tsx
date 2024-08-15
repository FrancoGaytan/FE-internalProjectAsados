import { EventStatesEnum } from '../../../../enums/EventState.enum';
import { useTranslation } from '../../../../stores/LocalizationContext';
import { TEventParticipationState, TEventState, TSubscribedState } from '../../../../types/eventState';

import { className } from '../../../../utils/className';
import styles from '../styles.module.scss';

interface IEventCardProps {
	evState: TEventState | TSubscribedState | TEventParticipationState;
	evParticipants: Number;
	isEventBlocking: Boolean;
	isAnotherEventBlocking: Boolean;
	evParticipantsLimit: Number;
	subscribedUser: Boolean;
	evDate: String;
}

export default function EventHeader(props: IEventCardProps) {
	const { evDate, evParticipants, evParticipantsLimit, evState, subscribedUser } = props;
	const lang = useTranslation('eventHome'); //TODO: aplicarlo a los nombres de los estados

	function isEventFull(): boolean {
		return evParticipants >= evParticipantsLimit;
	}

	function getEventState(): string | undefined {
		//Deuda Tecnica, hacer un elseif para esta funcion
		if (props.isEventBlocking) {
			return 'Debtor';
		}
		if (props.isAnotherEventBlocking) {
			return 'blocked';
		}

		if (evState === EventStatesEnum.FINISHED) {
			return EventStatesEnum.FINISHED;
		} //dejar este if para chequear

		if (evState === EventStatesEnum.AVAILABLE) {
			if (subscribedUser) {
				return 'subscribed';
			} else {
				if (isEventFull()) return EventStatesEnum.FULL;
			}
			return EventStatesEnum.AVAILABLE;
		} else if (evState === EventStatesEnum.CLOSED) {
			return EventStatesEnum.CLOSED;
		} else if (evState === EventStatesEnum.CANCELED) {
			return EventStatesEnum.CANCELED;
		} else if (isEventFull()) {
			return EventStatesEnum.FULL;
		} else {
			return EventStatesEnum.FINISHED;
		}
	}

	return (
		<div
			{...className(
				styles.cardContainer, //aca es importante el orden, si es que no condiciono las clases
				styles[getEventState() as string]
			)}>
			<section className={styles.cardTitleInfo}>
				<div className={styles.availabilityDesc}>{getEventState()?.toUpperCase()}</div>

				<div className={styles.eventCardDate}>{evDate.toString()}</div>
			</section>
		</div>
	);
}
