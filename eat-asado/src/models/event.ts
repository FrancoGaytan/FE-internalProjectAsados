import { EventStatesEnum } from '../enums/EventState.enum';
import { EventRatingData } from './ratings';
import { IUser } from './user';

export interface IEvent {
	title: string;
	datetime: Date;
	description: string;
	memberLimit: number;
	state: string;
	members: IUser[];
	organizer: IUser;
	chef: IUser | null;
	shoppingDesignee?: IUser[];
	isPrivate: boolean;
	penalization: number;
	penalizationStartDate: Date;
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
	ratings: EventRatingData;
}

export interface createEventRequest {
	title: string;
	datetime: Date;
	description: string;
	memberLimit: number;
	state: string;
	members: IUser[];
	organizer: IUser;
	isChef: string | null; //pedirle a nani que veamos esta propiedad, debería ser chef nomas
	shoppingDesignee?: IUser[];
	isPrivate: boolean;
	penalization: number;
	penalizationStartDate: Date;
}

export interface createRequest {
	title: string;
	description: string;
	datetime: Date;
	memberLimit: number;
	members: IUser[];
	organizer: number;
	chef?: string | null;
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
	chef: string | null;
	shoppingDesignee: IUser;
	transferReceipts: [];
	purchaseReceipts: [];
	_id: string;
	__v: 0;
	isPrivate?: boolean;
	penalization: number;
	penalizationStartDate: Date;
}

export interface EventByIdResponse {
	title: string;
	chef: IUser | null;
	datetime: Date;
	description: string;
	memberLimit: number;
	state: string;
	members: IUser[];
	organizer: IUser;
	shoppingDesignee: IUser[];
	transferReceipts: [];
	purchaseReceipts: [];
	ratings: [];
	_id: string;
	__v: 0;
	isPrivate?: boolean;
	penalization: number;
	penalizationStartDate: Date;
}
