import { EventStatesEnum } from '../enums/EventState.enum';

export type TEventState = EventStatesEnum.AVAILABLE | EventStatesEnum.CLOSED | EventStatesEnum.CANCELED | EventStatesEnum.FINISHED;

export type TSubscribedState = 'subscribed' | 'not-subscribed';

export type TEventParticipationState = EventStatesEnum.FULL | EventStatesEnum.INCOMPLETED;
