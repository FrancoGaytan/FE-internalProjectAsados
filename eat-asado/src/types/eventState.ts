import { EventStatesEnum } from "../enums/EventState.enum";

/* export type TEventState = EventStatesEnum.Available | EventStatesEnum.Closed | EventStatesEnum.Canceled; */
export type TEventState = EventStatesEnum.Available | EventStatesEnum.Closed | EventStatesEnum.Canceled;

export type TSubscribedState = 'subscribed' | 'not-subscribed';

export type TEventParticipationState = EventStatesEnum.Full | EventStatesEnum.Incompleted;