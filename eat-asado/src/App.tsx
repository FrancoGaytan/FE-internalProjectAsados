import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routes, { IRoute } from './routes';
import { GlobalProvider } from './stores/GlobalContext';
import { LocalizationProvider } from './stores/LocalizationContext';
import { EventProvider } from './stores/EventContext';
import RoutingComponent from './components/routing/RoutingComponent';
import { AlertProvider } from './stores/AlertContext';
import { AuthProvider } from './stores/AuthContext';
import { UserProvider } from './stores/UserContext';

function renderRoute(route: IRoute): JSX.Element {
	return <Route key={route.path} path={route.path} element={<RoutingComponent route={route} />} />;
}

export default function EatAsado(): JSX.Element {
	return (
		<BrowserRouter>
			<LocalizationProvider>
				<AlertProvider>
					<GlobalProvider>
						<AuthProvider>
							<UserProvider>
								<EventProvider>
									<Routes>{Object.entries(routes).map(([_, routes]) => renderRoute(routes))}</Routes>
								</EventProvider>
							</UserProvider>
						</AuthProvider>
					</GlobalProvider>
				</AlertProvider>
			</LocalizationProvider>
		</BrowserRouter>
	);
}
