import { useState } from 'react';
import { getLocalStorageKey, setLocalStorageKey } from '../utils/localStorageHelpers';

type ReturnType<T> = [storedValue: T, setValue: (value: T) => void];

export default function useLocalStorage<T>(key: string, initialValue: T): ReturnType<T> {
	const [storedValue, setStoredValue] = useState(() => {
		if (typeof window === 'undefined') return initialValue;

		try {
			const item = getLocalStorageKey(key);

			if (!item) return initialValue;

			return typeof item === 'string' ? item : JSON.parse(item);
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	});

	function setValue(value: T): void {
		try {
			setStoredValue(value);

			if (typeof window === 'undefined') return;

			if (typeof value === 'string') {
				setLocalStorageKey(key, value);
			} else {
				setLocalStorageKey(key, JSON.stringify(value));
			}
		} catch (error) {
			console.error(error);
		}
	}

	return [storedValue, setValue];
}
