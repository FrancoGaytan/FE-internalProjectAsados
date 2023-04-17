import { EventStatesEnum } from "../enums/EventState.enum";

/* export type TEventState = EventStatesEnum.Available | EventStatesEnum.Closed | EventStatesEnum.Canceled; */
export type TEventState = EventStatesEnum.AVAILABLE | EventStatesEnum.CLOSED | EventStatesEnum.CANCELED;

export type TSubscribedState = 'subscribed' | 'not-subscribed';

export type TEventParticipationState = EventStatesEnum.FULL | EventStatesEnum.INCOMPLETED;