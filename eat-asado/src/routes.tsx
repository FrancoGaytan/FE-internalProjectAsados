import { PathRouteProps } from 'react-router-dom';
import { Translation } from './localization';
import { CreateEvent, EventHome, Event, Login, RecoverKey, Register, SettingNewPassword, UserProfile, FAQ } from './pages';

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
		path: `/createEvent/:eventIdParam`,
		localizationKey: 'createEvent',
		element: <CreateEvent />,
		isPublic: true
	},
	event: {
		path: `/event/:eventId`,
		localizationKey: 'event',
		element: <Event />,
		isPublic: true
	},
	faq: {
		path: '/faq',
		localizationKey: 'faq',
		element: <FAQ />,
		isPublic: true
	}
};

export default routes;
