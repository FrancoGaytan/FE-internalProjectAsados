import { PathRouteProps } from 'react-router-dom';
import { Translation } from './localization';
import { CreateEvent, EventHome, Login, RecoverKey, Register, SettingNewPassword, UserProfile } from './pages';

export interface IRoute extends PathRouteProps {
	localizationKey?: keyof Translation['navigation'];
	childRoutes?: IRoute;
	isPublic?: boolean;
}

const routes: { [key: string]: IRoute } = {
	eventHome: {
		path: '/',
		localizationKey: 'eventHome',
		element: <EventHome />,
		isPublic: true
	},
	login: {
		path: '/login',
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
		isPublic: true
	}
};

export default routes;
