export function parseMinutes(minutes: string) {
	let newMinutes = minutes;
	if (Number(minutes) < 10) {
		newMinutes = '0' + minutes;
	}
	return newMinutes;
}
