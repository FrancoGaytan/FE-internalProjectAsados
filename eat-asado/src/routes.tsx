import { Navigate, PathRouteProps } from 'react-router-dom';
import { Translation } from './localization';
import Login from './Pages/Login/login';

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
	}
};

export default routes;