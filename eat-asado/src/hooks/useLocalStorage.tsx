import { useState } from 'react';

type ReturnType<T> = [storedValue: T, setValue: (value: T) => void];

export default function useLocalStorage<T>(key: string, initialValue: T): ReturnType<T> {
	const [storedValue, setStoredValue] = useState(() => {
		if (typeof window === 'undefined') return initialValue;

		try {
			const item = window.localStorage.getItem(key);

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
				window.localStorage.setItem(key, value);
			} else {
				window.localStorage.setItem(key, JSON.stringify(value));
			}
		} catch (error) {
			console.error(error);
		}
	}

	return [storedValue, setValue];
}
