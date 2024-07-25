import { createContext, PropsWithChildren, Dispatch, useContext, SetStateAction, useState, useEffect } from 'react';
import { defaultLocale, Translation, Locale, locales } from '../localization';
import { getObjectByKeys } from '../utils/common';
import useLocalStorage from '../hooks/useLocalStorage';
import { localStorageKeys } from '../utils/localStorageKeys';
import { NestedKeyOf } from '../utils/typeUtilities';

interface ILocalizationContext {
	locale: Locale;
	setLocale: Dispatch<SetStateAction<Locale>>;
}

const LocalizationContext = createContext<ILocalizationContext>({} as ILocalizationContext);

export function LocalizationProvider(props: PropsWithChildren<{}>): JSX.Element {
	const [storedLocale, storeLocale] = useLocalStorage(localStorageKeys.locale, defaultLocale.id);
	const [locale, setLocale] = useState<Locale>(locales.find(x => x.id === storedLocale) ?? defaultLocale);

	useEffect(() => {
		storeLocale(locale.id);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locale]);

	return <LocalizationContext.Provider value={{ locale, setLocale }}>{props.children}</LocalizationContext.Provider>;
}

export function useLocalizationContext(): ILocalizationContext {
	const context = useContext(LocalizationContext);

	if (Object.entries(context).length === 0) {
		throw new Error('useLocalization must be used within a LocalizationContext');
	}
	return context;
}

export function useTranslation<T = any>(key?: NestedKeyOf<Translation>): Translation | T {
	const { locale } = useLocalizationContext();
	return !key ? locale.translation : getObjectByKeys(locale.translation, key);
}
