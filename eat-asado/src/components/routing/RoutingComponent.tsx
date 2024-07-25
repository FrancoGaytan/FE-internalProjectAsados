import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PublicLayout from '../macro/PublicLayout';
//import PrivateLayout from '@/components/macro/PrivateLayout';
import { useTranslation } from '../../stores/LocalizationContext';
import { IRoute } from '../../routes';
import { changeTitle } from '../../utils/common';
import PrivateFormLayout from '../macro/layout/PrivateFormLayout';
import { useAuth } from '../../stores/AuthContext';

interface RoutingComponentProps {
	route: IRoute;
}

export default function RoutingComponent(props: RoutingComponentProps): JSX.Element {
	const { isAuthenticated } = useAuth();

	const translation = useTranslation('navigation');

	useEffect(() => changeTitle(translation[props.route.localizationKey || '']), [props.route, translation]);

	if (props.route.isPublic) {
		return <PublicLayout>{props.route.element}</PublicLayout>;
	}

	return !isAuthenticated ? <Navigate to="/login" /> : <PrivateFormLayout>{props.route.element}</PrivateFormLayout>;
}
