import { createContext, useContext, useState, PropsWithChildren, JSX } from 'react';
import { IUser } from '../models/user';

interface IUserContext {
	users: IUser[];
}

const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserProvider(props: PropsWithChildren<{}>): JSX.Element {
	const [users] = useState<IUser[]>([]);

	return <UserContext.Provider value={{ users }}>{props.children}</UserContext.Provider>;
}

export function useUser(): IUserContext {
	const context = useContext(UserContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
