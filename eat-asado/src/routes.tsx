import { Navigate, PathRouteProps } from 'react-router-dom';
import { Translation } from './localization';
import { settingNewPassword } from './localization/en-us/settingNewPassword';
import CreateEvent from './Pages/CreateEvent/CreateEvent';
import Login from './Pages/Login/Login';
import RecoverKey from './Pages/RecoverKey/RecoverKey';
import Register from './Pages/Register/Register';
import SettingNewPassword from './Pages/SettingNewPassword/SettingNewPassword';
import UserProfile from './Pages/UserProfile/UserProfile';

export interface IRoute extends PathRouteProps {
	localizationKey?: keyof Translation['navigation'];
	childRoutes?: IRoute;
	isPublic?: boolean;
}

const routes: { [key: string]: IRoute } = {
	login: {
		path: '/',
		localizationKey: 'login',
		element: <Login />,
		isPublic: true
	},
	register: {
		path: '/register',
		localizationKey: 'register',
		element: <Register />,
		isPublic: true
	},
	recoverKey: {
		path: '/recoverKey',
		localizationKey: 'recoverKey',
		element: <RecoverKey />,
		isPublic: true
	},
	settingNewPassword: {
		path: '/settingNewPassword',
		localizationKey: 'settingNewPassword',
		element: <SettingNewPassword />,
		isPublic: true
	},
	userProfile: {
		path: '/userProfile',
		localizationKey: 'userProfile',
		element: <UserProfile />,
		isPublic: false
	},
	createEvent: {
		path: '/createEvent',
		localizationKey: 'createEvent',
		element: <CreateEvent />,
		isPublic: false
	}
};

export default routes;
