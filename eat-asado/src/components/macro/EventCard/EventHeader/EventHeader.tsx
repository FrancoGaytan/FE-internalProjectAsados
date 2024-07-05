import { EventStatesEnum } from '../../../../enums/EventState.enum';
import { TEventState } from '../../../../types/eventState';
import { className } from '../../../../utils/className';
import styles from '../styles.module.scss';

interface IEventCardProps {
	evState: TEventState;
	evParticipants: Number;
	evParticipantsLimit: Number;
	subscribedUser: Boolean;
	evDate: String;
}

export default function EventHeader(props: IEventCardProps) {
	const { evDate, evParticipants, evParticipantsLimit, evState, subscribedUser } = props;

	function isEventFull(): boolean {
		return evParticipants >= evParticipantsLimit;
	}

	function getEventState(): string | undefined {
		//Deuda Tecnica, hacer un elseif para esta funcion
		if (evState === EventStatesEnum.AVAILABLE) {
			if (subscribedUser) {
				return 'subscribed';
			} else {
				if (isEventFull()) return EventStatesEnum.FULL;
			}

			//TODO: Chech this logic. This code is unreachable.
			return EventStatesEnum.AVAILABLE;
		} else if (evState === EventStatesEnum.CLOSED) {
			if (!subscribedUser) {
				return EventStatesEnum.CLOSED;
			}

			return 'subscribed';
		} else if (evState === EventStatesEnum.CANCELED) {
			return EventStatesEnum.CANCELED;
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
