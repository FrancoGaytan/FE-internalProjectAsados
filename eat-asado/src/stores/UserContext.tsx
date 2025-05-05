import { createContext, useContext, useState, PropsWithChildren, JSX } from 'react';
import { IUser } from '../models/user'; //TODO: hay que corregir esta interfaz ahora es la posta fijate de rehacer los ultimos cambios

interface IUserContext {
	users: IUser[];
}

const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserProvider(props: PropsWithChildren<{}>): JSX.Element {
	const [users] = useState<IUser[]>([]);

	/**
	 * Fetches the users.
	 */
	//FIXME: Check this.

	/* useEffect(() => {
		const abortController = new AbortController();

		getUsers(abortController.signal)
			.then(res => {
				setUsers(res);
				console.log(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});

			TODO: Es redundante que los context que están montados a nivel global en la app hagan abort de fetchs porque nunca se desmontan.
			Nunca se ejecuta la función return del useEffect.
			
		return () => abortController.abort();
	}, []); */

	return <UserContext.Provider value={{ users }}>{props.children}</UserContext.Provider>;
}

export function useUser(): IUserContext {
	const context = useContext(UserContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
