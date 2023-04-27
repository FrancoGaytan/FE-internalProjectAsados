import { EventStatesEnum } from '../enums/EventState.enum';
import { IUser } from './user';
//TODO: validar que estas interfaces esten completas
export interface IEvent {
	title: string;
	datetime: Date;
	description: string;
	memberLimit: number;
	state: string;
	members: number[];
	organizer: number;
	isChef?: boolean;
	isShoppingDesignee?: boolean;
}

export interface IPublicEvent {
	chef: string;
	datetime: Date;
	description: string;
	members: number;
	state: EventStatesEnum;
	_id: string;
}

export interface createRequest {
	title: string;
	description: string;
	datetime: Date;
	memberLimit: number;
	members: IUser[]; //TODO: Chequear que sea asi
	organizer: number;
	chef?: number;
	shoppingDesignee?: number;
}

export interface createResponse {
	title: string;
	datetime: Date;
	description: string;
	memberLimit: number;
	state: string;
	members: string[];
	organizer: string;
	transferReceipts: [];
	purchaseReceipts: [];
	_id: string;
	__v: 0;
}
