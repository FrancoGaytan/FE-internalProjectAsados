import { EventStatesEnum } from '../enums/EventState.enum';
//TODO: validar que estas interfaces esten completas
export interface IEvent {
	name: string;
	dateAndHour: Date;
	description: string;
	diners: number;
}

export interface IPublicEvent {
	chef: string;
	datetime: Date;
	description: string;
	members: number;
	state: EventStatesEnum;
	_id: string;
}
