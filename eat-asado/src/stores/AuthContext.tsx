import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useState, PropsWithChildren, useEffect, SetStateAction } from 'react';
import { localStorageKeys } from '.././utils/localStorageKeys';

interface IAuthContext {
	user: any;
	setUser: React.Dispatch<SetStateAction<any>>;
	logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider(props: PropsWithChildren<{}>): JSX.Element {
	const [user, setUser] = useState({});
	const navigate = useNavigate();

	function logout() {
		localStorage.removeItem(localStorageKeys.token);
		navigate('/login');
	}

	return <AuthContext.Provider value={{ user, setUser, logout }}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): IAuthContext {
	const context = useContext(AuthContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
