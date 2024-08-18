import "./style/app.css";

import { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/redux/store";
import PageLoader from "@/components/PageLoader";
import { App as AntdApp } from "antd"; // Import Antd's App component
const Os = lazy(() => import("./apps/Os"));

export default function RoutApp() {
	return (
		<BrowserRouter>
			<Provider store={store}>
				<Suspense fallback={<PageLoader />}>
					{/* <AntdApp> */}
					<Os />
					{/* </AntdApp> */}
				</Suspense>
			</Provider>
		</BrowserRouter>
	);
}
