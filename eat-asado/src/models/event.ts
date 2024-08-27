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
	isChef?: string | undefined; // TODO: No debería ser boolean esto?
	isShoppingDesignee?: string; // TODO: No debería ser boolean esto?
	isPrivate: boolean;
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
	isPrivate: boolean;
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
	isPrivate: boolean;
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
	isPrivate?: boolean;
}
