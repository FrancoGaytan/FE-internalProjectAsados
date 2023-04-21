import { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { getPublicEvents } from '../service';
import { IPublicEvent } from '../models/event';

interface IEventContext {
	publicEvents: IPublicEvent[];
}

const EventContext = createContext<IEventContext>({} as IEventContext);

export function EventProvider(props: PropsWithChildren<{}>): JSX.Element {
	const [publicEvents, setPublicEvents] = useState<IPublicEvent[]>([]);

	/**
	 * Fetches the public events for the Home Event page.
	 */
	useEffect(() => {
		const abortController = new AbortController();

		getPublicEvents(abortController.signal)
			.then(res => {
				setPublicEvents(res);
				console.log(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});

		return () => abortController.abort();
	}, []);

	return <EventContext.Provider value={{ publicEvents }}>{props.children}</EventContext.Provider>; //este publicEvents es lo que me tengo que llevar para tener la data posta y reemplazar la moockeada
}

export function useEvent(): IEventContext {
	const context = useContext(EventContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
