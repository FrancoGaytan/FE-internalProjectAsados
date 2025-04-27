export function setLocalStorageKey(key: string, value: string) {
	window.localStorage.setItem(key, value);
}

export function getLocalStorageKey(key: string): string | null {
	return window.localStorage.getItem(key);
}

export function removeLocalStorageKey(key: string) {
	window.localStorage.removeItem(key);
}
