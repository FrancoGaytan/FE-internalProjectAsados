import { login } from "./login";
import { navigation } from "./navigation";
import { register } from "./register";
import { recoverKey } from "./recoverKey";
import { settingNewPassword } from "./settingNewPassword";
import { userProfile } from "./userProfile";

export const esAr = Object.seal({
	appName: 'Eat-Asado',
	login,
	navigation,
	register,
	recoverKey,
	settingNewPassword,
	userProfile,
});