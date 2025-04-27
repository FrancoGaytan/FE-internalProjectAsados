import { EventStatesEnum } from '../../../../enums/EventState.enum';
import { useLocalizationContext, useTranslation } from '../../../../stores/LocalizationContext';
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
	const { locale } = useLocalizationContext();

	function isEventFull(): boolean {
		return evParticipants >= evParticipantsLimit;
	}

	function getEventState(): string | undefined {
		
		//Deuda Tecnica, hacer un elseif para esta funcion
		if (props.isEventBlocking) {
			return 'debtor';
		}
		if (props.isAnotherEventBlocking) {
			return 'blocked';
		}

		switch (evState) {
			case EventStatesEnum.FINISHED:
			case EventStatesEnum.CLOSED:
			case EventStatesEnum.CANCELED:
				return evState;
			case EventStatesEnum.AVAILABLE:
				let eventState: string;
				if(subscribedUser) {
					eventState = 'subscribed';
				} else if (isEventFull()) {
					eventState = EventStatesEnum.FULL;
				} else {
					eventState = evState;
				}
				return eventState;
			default:
				return isEventFull() ? EventStatesEnum.FULL : EventStatesEnum.FINISHED;
				
		}

	}

	function getTranslatedState(stateDesc: string | undefined) {
		//primero evaluar con un if si el idioma esta en ingles, sino no hagas nada
		if (locale.id === 'es-AR') {
			switch (stateDesc) {
				case EventStatesEnum.AVAILABLE:
					return 'DISPONIBLE';
				case EventStatesEnum.CANCELED:
					return 'CANCELADO';
				case EventStatesEnum.FULL:
					return 'LLENO';
				case EventStatesEnum.FINISHED:
					return 'FINALIZADO';
				case EventStatesEnum.CLOSED:
					return 'CERRADO';
				case 'subscribed':
					return 'SUBSCRIPTO';
				case 'blocked':
					return 'BLOCKEADO';
				case 'debtor':
					return 'DEUDOR';
			}
		} else {
			return stateDesc;
		}
	}

	return (
		<div
			{...className(
				styles.cardContainer, //aca es importante el orden, si es que no condiciono las clases
				styles[getEventState() as string]
			)}>
			<section className={styles.cardTitleInfo}>
				<div className={styles.availabilityDesc}>{getTranslatedState(getEventState())?.toUpperCase()}</div>

				<div className={styles.eventCardDate}>{evDate.toString()}</div>
			</section>
		</div>
	);
}
