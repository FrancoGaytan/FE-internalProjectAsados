import { EventStatesEnum } from "../enums/EventState.enum";

export type TEventState = EventStatesEnum.Available | EventStatesEnum.Closed | EventStatesEnum.Canceled;//available puede ser open tambien, decidir con la gente de ba

export type TSubscribedState = 'subscribed' | 'not-subscribed';

export type TEventParticipationState = EventStatesEnum.Full | EventStatesEnum.Incompleted;