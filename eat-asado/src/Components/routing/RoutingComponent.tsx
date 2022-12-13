import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PublicLayout from '../macro/PublicLayout';
//import PrivateLayout from '@/components/macro/PrivateLayout';
import { useTranslation } from '../../stores/LocalizationContext';
import { IRoute } from '../../routes';
import { changeTitle } from '../../utils/common';

interface RoutingComponentProps {
	//isPublic?: boolean;
	route: IRoute;
}

export default function RoutingComponent(props: RoutingComponentProps): JSX.Element {
	//const { authenticated } = useAuth();
	const translation = useTranslation('navigation');

	useEffect(() => changeTitle(translation[props.route.localizationKey || '']), [props.route, translation]);

	if (props.route.isPublic) {
		return <PublicLayout>{props.route.element}</PublicLayout>;
	}

	return <Navigate to="/login" />;

	//return !authenticated ? <Navigate to="/login" /> : <PrivateLayout>{props.route.element}</PrivateLayout>;
	//todo: ver como nos vamos a autenticar, en este ejemplo comentado teníamos un hook useAuth que utilizaba
			// apolo y validaba si un usuario esta autenticado o no 
}
