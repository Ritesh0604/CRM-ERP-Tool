import { lazy, useEffect } from "react";

import {} from "react-router-dom";
import {} from "react-router-dom";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import { useAppContext } from "@/context/appContext";

import routes from "./routes";

export default function AppRouter() {
	const location = useLocation();
	const { state: stateApp, appContextAction } = useAppContext();
	const { app } = appContextAction;

	const routesList = [];

	for (const [key, value] of Object.entries(routes)) {
		routesList.push(...value);
	}

	// Memoize the getAppNameByPath function
	const getAppNameByPath = useCallback(
		(path) => {
			for (const key in routes) {
				for (let i = 0; i < routes[key].length; i++) {
					if (routes[key][i].path === path) {
						return key;
					}
				}
			}
			// Return 'default' app if the path is not found
			return "default";
		},
		[routes],
	);

	useEffect(() => {
		if (location.pathname === "/") {
			app.default();
		} else {
			const path = getAppNameByPath(location.pathname);
			app.open(path);
		}
	}, [location.pathname, app, getAppNameByPath]);

	const element = useRoutes(routesList);

	return element;
}
