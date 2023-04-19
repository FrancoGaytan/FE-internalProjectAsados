import { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';

interface IAuthContext {}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider(props: PropsWithChildren<{}>): JSX.Element {
	return <AuthContext.Provider value={{}}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): IAuthContext {
	const context = useContext(AuthContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
