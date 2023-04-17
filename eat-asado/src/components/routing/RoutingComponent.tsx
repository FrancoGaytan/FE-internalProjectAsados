import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PublicLayout from '../macro/PublicLayout';
//import PrivateLayout from '@/components/macro/PrivateLayout';
import { useTranslation } from '../../stores/LocalizationContext';
import { IRoute } from '../../routes';
import { changeTitle } from '../../utils/common';
import PrivateFormLayout from '../macro/layout/PrivateFormLayout';

interface RoutingComponentProps {
	route: IRoute;
}

export default function RoutingComponent(props: RoutingComponentProps): JSX.Element {
	const authenticated = true; // TODO: Here we should check if user is auth.
	const translation = useTranslation('navigation');

	useEffect(() => changeTitle(translation[props.route.localizationKey || '']), [props.route, translation]);

	if (props.route.isPublic) {
		return <PublicLayout>{props.route.element}</PublicLayout>;
	}

	return !authenticated ? <Navigate to="/login" /> : <PrivateFormLayout>{props.route.element}</PrivateFormLayout>;
}
