import { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { getPublicEvents } from '../services/eventService';
import { IEvent } from '../models/event';

interface IEventContext {
	publicEvents: IEvent[];
}

const EventContext = createContext<IEventContext>({} as IEventContext);

export function EventProvider(props: PropsWithChildren<{}>): JSX.Element {
	const [publicEvents, setPublicEvents] = useState<IEvent[]>([]);

	useEffect(() => {
		getPublicEvents().then(res => {
			console.log(res);
			setPublicEvents(res);
		});
	}, []);

	return <EventContext.Provider value={{ publicEvents }}>{props.children}</EventContext.Provider>;
}

export function useEvent(): IEventContext {
	const context = useContext(EventContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
