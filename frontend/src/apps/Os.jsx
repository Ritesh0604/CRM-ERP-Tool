import { lazy, Suspense, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/selectors";
import { AppContextProvider } from "@/context/appContext";
import PageLoader from "@/components/PageLoader";
import AuthRouter from "@/router/AuthRouter";
import Localization from "@/locale/Localization";
import { notification } from "antd";

const ErpApp = lazy(() => import("./ErpApp"));

const DefaultApp = () => (
	<Localization>
		<AppContextProvider>
			<Suspense fallback={<PageLoader />}>
				<ErpApp />
			</Suspense>
		</AppContextProvider>
	</Localization>
);

const checkInternetConnection = async () => {
	try {
		const response = await fetch("https://www.google.com", { mode: "no-cors" });
		return response.status >= 200 && response.status < 300;
	} catch (error) {
		return false;
	}
};

export default function Os() {
	const { isLoggedIn } = useSelector(selectAuth);

	// Online state
	const [isOnline, setIsOnline] = useState(navigator.onLine);

	useEffect(() => {
		// Update network status
		const handleStatusChange = async () => {
			const online = await checkInternetConnection();
			setIsOnline(navigator.onLine);
			if (!isOnline) {
				console.log("🚀 ~ useEffect ~ navigator.onLine:", navigator.onLine);
				notification.config({
					duration: 20,
					maxCount: 1,
				});
				// Code to execute when there is internet connection
				notification.error({
					message: "No internet connection",
					description:
						"Cannot connect to the Internet, Check your internet network",
				});
			}
		};
		handleStatusChange();
		// Listen to the online status
		window.addEventListener("online", handleStatusChange);

		// Listen to the offline status
		window.addEventListener("offline", handleStatusChange);

		// Specify how to clean up after this effect for performance improvement
		return () => {
			window.removeEventListener("online", handleStatusChange);
			window.removeEventListener("offline", handleStatusChange);
		};
	}, [isOnline]);

	if (!isLoggedIn)
		return (
			<Localization>
				<AuthRouter />
			</Localization>
		);
	return <DefaultApp />;
}
