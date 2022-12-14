import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/login';
import routes, { IRoute } from './routes';
import { GlobalProvider } from './stores/GlobalContext';
import { LocalizationProvider } from './stores/LocalizationContext';
import RoutingComponent from './Components/routing/RoutingComponent';

function renderRoute(route: IRoute): JSX.Element {
	return <Route key={route.path} path={route.path} element={<RoutingComponent route={route} />} />;
}

export default function EatAsado(): JSX.Element {
	return (
		<BrowserRouter>
			<GlobalProvider>
				<LocalizationProvider>
					<Routes>{Object.entries(routes).map(([_, routes]) => renderRoute(routes))}</Routes>;
				</LocalizationProvider>
			</GlobalProvider>
		</BrowserRouter>
	);
}
