import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useState, PropsWithChildren, SetStateAction } from 'react';
import { localStorageKeys } from '.././utils/localStorageKeys';
import { IUser } from '../models/user';

interface IAuthContext {
	user: IUser | null;
	isLoading: boolean;
	setIsLoading: React.Dispatch<SetStateAction<boolean>>;
	isAuthenticated: () => string | false;
	setUser: React.Dispatch<SetStateAction<any>>;
	logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider(props: PropsWithChildren<{}>): JSX.Element {
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	/**
	 * Logs out current user
	 */
	function logout() {
		localStorage.removeItem(localStorageKeys.token);
		setUser(null);
		navigate('/login');
	}

	/**
	 * Cheks if the user is authenticated
	 */
	function isAuthenticated(): string | false {
		const token = localStorage.getItem(localStorageKeys.token);
		if (token) {
			return token;
		} else {
			return false;
		}
	}

	return <AuthContext.Provider value={{ user, isLoading, setIsLoading, isAuthenticated, setUser, logout }}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): IAuthContext {
	const context = useContext(AuthContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
