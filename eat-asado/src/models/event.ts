import { EventStatesEnum } from '../enums/EventState.enum';
import { IUser } from './user';

export interface IEvent {
	title: string;
	datetime: Date;
	description: string;
	memberLimit: number;
	state: string;
	members: IUser[];
	organizer: string;
	isChef?: string | undefined;
	isShoppingDesignee?: string;
}

export interface IPublicEvent {
	chef: string;
	datetime: Date;
	description: string;
	members: number;
	memberLimit: number;
	state: EventStatesEnum;
	title: string;
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

export interface EventResponse {
	title: string;
	datetime: Date;
	description: string;
	memberLimit: number;
	state: string;
	members: string[];
	organizer: IUser;
	shoppingDesignee: IUser;
	transferReceipts: [];
	purchaseReceipts: [];
	_id: string;
	__v: 0;
}
