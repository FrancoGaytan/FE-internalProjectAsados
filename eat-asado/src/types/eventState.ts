import { EventStatesEnum } from '../enums/EventState.enum';

export type TEventState =
	| EventStatesEnum.AVAILABLE
	| EventStatesEnum.CLOSED
	| EventStatesEnum.CANCELED
	| EventStatesEnum.FINISHED
	| EventStatesEnum.READYFORPAYMENT;

export type TSubscribedState = 'subscribed' | 'not-subscribed';

export type TEventParticipationState = EventStatesEnum.FULL | EventStatesEnum.INCOMPLETED;
