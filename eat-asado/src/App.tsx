import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routes, { IRoute } from './routes';
import { GlobalProvider } from './stores/GlobalContext';
import { LocalizationProvider } from './stores/LocalizationContext';
import RoutingComponent from './Components/routing/RoutingComponent';
import { AlertProvider } from './stores/AlertContext';

function renderRoute(route: IRoute): JSX.Element {
	return <Route key={route.path} path={route.path} element={<RoutingComponent route={route} />} />;
}

export default function EatAsado(): JSX.Element {
	return (
		<BrowserRouter>
			<GlobalProvider>
				<LocalizationProvider>
					<AlertProvider>
						<Routes>{Object.entries(routes).map(([_, routes]) => renderRoute(routes))}</Routes>
					</AlertProvider>
				</LocalizationProvider>
			</GlobalProvider>
		</BrowserRouter>
	);
}
