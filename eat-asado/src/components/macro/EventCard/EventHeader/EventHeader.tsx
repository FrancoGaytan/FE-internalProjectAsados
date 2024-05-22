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

const EventHeader = (props: IEventCardProps) => {
	const evState = props.evState;
	const evParticipants = props.evParticipants;
	const evParticipantsLimit = props.evParticipantsLimit;
	const subscribedUser = props.subscribedUser;
	const evDate = props.evDate;

	function isEventFull(): boolean {
		return evParticipants >= evParticipantsLimit;
	}

	function getEventState(): string | undefined {
		if (evState === EventStatesEnum.AVAILABLE) {
			if (subscribedUser) {
				return 'subscribed';
			} else {
				if (isEventFull()) return EventStatesEnum.FULL;
			}
			return EventStatesEnum.AVAILABLE;
		}
		if (evState === EventStatesEnum.CLOSED) {
			if (subscribedUser) {
				return 'subscribed';
			} else {
				return EventStatesEnum.CLOSED;
			}
		}
		if (evState === EventStatesEnum.CANCELED) {
			return EventStatesEnum.CANCELED;
		}
		if (evState === EventStatesEnum.FINISHED) {
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
};

export default EventHeader;
