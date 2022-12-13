import { createContext, useContext, Dispatch, SetStateAction, useState, PropsWithChildren } from 'react';

interface IGlobalContext {
	isSomethingLoading: boolean;
	setIsSomethingLoading: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = createContext<IGlobalContext>({} as IGlobalContext);

export function GlobalProvider(props: PropsWithChildren<{}>): JSX.Element {
	const [isSomethingLoading, setIsSomethingLoading] = useState<boolean>(false);

	return <GlobalContext.Provider value={{ isSomethingLoading, setIsSomethingLoading }}>{props.children}</GlobalContext.Provider>;
}

export function useGlobal(): IGlobalContext {
	const context = useContext(GlobalContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}