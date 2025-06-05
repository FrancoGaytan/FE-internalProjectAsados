import React, { createContext, useContext, useState, PropsWithChildren, SetStateAction, JSX } from 'react';
import { IPublicEvent } from '../models/event';

interface IEventContext {
	publicEvents: IPublicEvent[];
	setPublicEvents: React.Dispatch<SetStateAction<IPublicEvent[]>>;
}

const EventContext = createContext<IEventContext>({} as IEventContext);

export function EventProvider(props: PropsWithChildren<{}>): JSX.Element {
	const [publicEvents, setPublicEvents] = useState<IPublicEvent[]>([]);

	return <EventContext.Provider value={{ publicEvents, setPublicEvents }}>{props.children}</EventContext.Provider>; //este publicEvents es lo que me tengo que llevar para tener la data posta y reemplazar la moockeada
}

export function useEvent(): IEventContext {
	const context = useContext(EventContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
