import { login } from './login';
import { navigation } from './navigation';
import { register } from './register';
import { recoverKey } from './recoverKey';
import { settingNewPassword } from './settingNewPassword';
import { userProfile } from './userProfile';
import { createEvent } from './createEvent';
import { eventHome } from './eventHome';
import { event } from './event';
import { faq } from './faq';

export const esAr = Object.seal({
	appName: 'FoodSpot',
	login,
	navigation,
	register,
	recoverKey,
	settingNewPassword,
	userProfile,
	createEvent,
	eventHome,
	event,
	faq
});
