export function getObjectByKeys<T>(object: any, key: string): T {
	return key.split('.').reduce((acc, key) => (acc as any)[key], object);
}

export function replaceAll(string: string, search: string, replace: string): string {
	return string.replace(new RegExp(search, 'gi'), replace);
}

export function translateWithParams(localizationString: string, translationParams: { [key: string]: string | number }): string {
	if (translationParams) {
		for (const param of Object.entries(translationParams)) {
			localizationString = replaceAll(localizationString, `{{${param[0]}}}`, String(param[1]));
		}
	}

	return localizationString;
}

export function changeTitle(title: string): void {
	document.title = `FoodSpot - ${title}`;
}
