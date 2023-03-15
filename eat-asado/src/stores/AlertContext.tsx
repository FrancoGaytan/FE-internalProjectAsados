import { createContext, useState } from "react";
import { AlertTypes } from "../Components/micro/AlertPopup/AlertPopup";

const ALERT_TIME = 3000;
const initialState = {
    text: '',
    type: null as unknown as AlertTypes
}

const AlertContext = createContext({
    ...initialState,
    setAlert: (text: string, type: AlertTypes) => {}
});

export const AlertProvider = ({children}: any) => {
    const [text, setText] = useState('');
    const [type, setType] = useState(null as unknown as AlertTypes);

    const setAlert = (text: string, type: AlertTypes) => {
        setText(text);
        setType(type);

        setTimeout(() => {
            setText('');
            setType(null as unknown as AlertTypes)
        }, ALERT_TIME);
    };

    return (
        <AlertContext.Provider
            value={{
                text,
                type,
                setAlert,
            }}
        >
            {children}
        </AlertContext.Provider>
    )
}

export default AlertContext;