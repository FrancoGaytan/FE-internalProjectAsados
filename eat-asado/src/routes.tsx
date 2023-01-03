import { Navigate, PathRouteProps } from 'react-router-dom';
import { Translation } from './localization';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';

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
	}
};

export default routes;