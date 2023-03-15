import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PublicLayout from '../macro/PublicLayout';
//import PrivateLayout from '@/components/macro/PrivateLayout';
import { useTranslation } from '../../stores/LocalizationContext';
import { IRoute } from '../../routes';
import { changeTitle } from '../../utils/common';
import PrivateFormLayout from '../macro/layout/PrivateFormLayout';
import AlertPopup from '../micro/AlertPopup/AlertPopup';

interface RoutingComponentProps {
	//isPublic?: boolean;
	route: IRoute;
}

export default function RoutingComponent(props: RoutingComponentProps): JSX.Element {
	//const { authenticated } = useAuth();
	const translation = useTranslation('navigation');

	useEffect(() => changeTitle(translation[props.route.localizationKey || '']), [props.route, translation]);

	if (props.route.isPublic) {
		return (
			<PublicLayout>
				<AlertPopup />
				{props.route.element}
			</PublicLayout>
			);
	} else {
		return (
			<PrivateFormLayout>
				<AlertPopup />
				{props.route.element}
			</PrivateFormLayout>
			);
	}

	//return <Navigate to="/login" />;

	//return !authenticated ? <Navigate to="/login" /> : <PrivateLayout>{props.route.element}</PrivateLayout>;
	//todo: ver como nos vamos a autenticar, en este ejemplo comentado teníamos un hook useAuth que utilizaba
	// apolo y validaba si un usuario esta autenticado o no
}
