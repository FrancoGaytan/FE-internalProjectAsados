export function parseMinutes(minutes: string) {
	let newMinutes = minutes;
	if (Number(minutes) < 10) {
		newMinutes = '0' + minutes;
	}
	return newMinutes;
}

export const downloadFile = ({ file, fileName }: any): any => {
	const blob = new Blob([file], { type: file.type });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();

	URL.revokeObjectURL(url);
	document.body.removeChild(link);
};

export const browserName = (function (agent) {
	switch (true) {
		case agent.indexOf('edge') > -1:
			return 'Edge';
		case agent.indexOf('edg/') > -1:
			return 'Edge';
		case agent.indexOf('trident') > -1:
			return 'MS IE';
		case agent.indexOf('firefox') > -1:
			return 'Mozilla Firefox';
		case agent.indexOf('safari') > -1:
			return 'Safari';
		default:
			return 'other';
	}
})(window.navigator.userAgent.toLowerCase());
