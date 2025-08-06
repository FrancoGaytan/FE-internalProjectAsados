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
	userHasPaid: Boolean;
	userIntoTheEvent: Boolean;
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

		if (evState === EventStatesEnum.FINISHED) {
			return EventStatesEnum.FINISHED;
		} //dejar este if para chequear

		if (evState === EventStatesEnum.READYFORPAYMENT) {
			return props.userHasPaid ? EventStatesEnum.CLOSED : !props.userIntoTheEvent ? EventStatesEnum.CLOSED : EventStatesEnum.READYFORPAYMENT;
		}

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

	function getTranslatedState(stateDesc: string | undefined) {
		//primero evaluar con un if si el idioma esta en ingles, sino no hagas nada
		if (locale.id === 'es-AR') {
			switch (stateDesc) {
				case EventStatesEnum.AVAILABLE:
					return 'DISPONIBLE';
				case EventStatesEnum.CANCELED:
					return 'CANCELADO';
				case EventStatesEnum.READYFORPAYMENT:
					return 'ABONABLE';
				case EventStatesEnum.FULL:
					return 'LLENO';
				case EventStatesEnum.FINISHED:
					return 'FINALIZADO';
				case EventStatesEnum.CLOSED:
					return 'CERRADO';
				case 'subscribed':
					return 'SUBSCRIPTO';
				case 'blocked':
					return 'BLOQUEADO';
				case 'debtor':
					return 'DEUDOR';
			}
		} else {
			return stateDesc;
		}
	}

	function getParticularNameChanges(stateDesc: string | undefined) {
		if (stateDesc === 'READYFORPAYMENT') {
			return 'READY TO PAY';
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
				<div className={styles.availabilityDesc}>{getParticularNameChanges(getTranslatedState(getEventState())?.toUpperCase())}</div>

				<div className={styles.eventCardDate}>{evDate.toString()}</div>
			</section>
		</div>
	);
}
