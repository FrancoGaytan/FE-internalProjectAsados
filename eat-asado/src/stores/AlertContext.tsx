import { createContext, useContext, useState } from 'react';
import { AlertTypes } from '../components/micro/AlertPopup/AlertPopup';

const ALERT_TIME = 3000;
const initialState = {
	text: '',
	type: null as unknown as AlertTypes
};

const AlertContext = createContext({
	...initialState,
	setAlert: (text: string, type: AlertTypes) => {}
});

export function AlertProvider({ children }: any) {
	const [text, setText] = useState('');
	const [type, setType] = useState(null as unknown as AlertTypes);

	const setAlert = (text: string, type: AlertTypes) => {
		setText(text);
		setType(type);

		setTimeout(() => {
			setText('');
			setType(null as unknown as AlertTypes);
		}, ALERT_TIME);
	};

	return (
		<AlertContext.Provider
			value={{
				text,
				type,
				setAlert
			}}>
			{children}
		</AlertContext.Provider>
	);
}

/**
 * Exposes the localization context
 */
export function useAlert(): any {
	const context = useContext(AlertContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useGlobal must be used within a GlobalContext');
	}

	return context;
}
