import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useState, PropsWithChildren, SetStateAction, useEffect } from 'react';
import { localStorageKeys } from '.././utils/localStorageKeys';
import { IUser, LoginResponse } from '../models/user';
import { _login } from '../service';
import { useAlert } from './AlertContext';
import { AlertTypes } from '../components/micro/AlertPopup/AlertPopup';
import { useTranslation } from './LocalizationContext';

interface IAuthContext {
	user: LoginResponse | IUser | null;
	isLoading: boolean;
	setIsLoading: React.Dispatch<SetStateAction<boolean>>;
	isAuthenticated: () => boolean;
	setUser: React.Dispatch<SetStateAction<LoginResponse | IUser | null>>;
	logout: () => void;
	login: (email: string, password: string) => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider(props: PropsWithChildren<{}>): JSX.Element {
	const navigate = useNavigate();
	const [user, setUser] = useState<LoginResponse | IUser | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { setAlert } = useAlert();
	const lang = useTranslation('login');

	/**
	 * Logs in user
	 */
	function login(email: string, password: string): void {
		setIsLoading(true);

		_login({ email, password })
			.then(res => {
				localStorage.setItem(localStorageKeys.user, JSON.stringify(res));
				setUser(res);
				setAlert(`${lang.welcomeMessage} ${res.name}!`, AlertTypes.SUCCESS);
				navigate('/');
			})
			.catch(error => {
				setAlert(lang.loginErrorMessage, AlertTypes.ERROR);
				throw new Error(error);
			})
			.finally(() => setIsLoading(false));
	}

	/**
	 * Logs out current user
	 */
	function logout() {
		localStorage.removeItem(localStorageKeys.user);
		setUser(null);
		navigate('/login');
	}

	function getUserFromLocalStorage(): LoginResponse {
		return JSON.parse(localStorage.getItem(localStorageKeys.user) ?? '{}');
	}

	/**
	 * Checks if user is auth
	 */
	function isAuthenticated(): boolean {
		return !!getUserFromLocalStorage();
	}

	/**
	 * Looks for a logged user when app initialize
	 */
	useEffect(() => {
		setUser(getUserFromLocalStorage());
	}, []);

	return (
		<AuthContext.Provider value={{ user, isLoading, setIsLoading, isAuthenticated, setUser, logout, login }}>
			{props.children}
		</AuthContext.Provider>
	);
}

export function useAuth(): IAuthContext {
	const context = useContext(AuthContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
