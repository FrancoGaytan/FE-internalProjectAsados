import { login } from "./login";
import { navigation } from "./navigation";
import { register } from "./register";
import { recoverKey } from "./recoverKey";
import { settingNewPassword } from "./settingNewPassword";
import { userProfile } from "./userProfile";
import { createEvent } from "./createEvent";

export const enUS = Object.seal({
	appName: 'Eat-Meat',
	login,
	navigation,
	register,
	recoverKey,
	settingNewPassword,
	userProfile,
	createEvent,
});