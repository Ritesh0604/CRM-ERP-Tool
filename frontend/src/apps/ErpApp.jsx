import { useLayoutEffect } from "react";
import { useEffect } from "react";
import { selectAppSettings } from "@/redux/settings/selectors";
import { useDispatch, useSelector } from "react-redux";

import { Layout } from "antd";

import { useAppContext } from "@/context/appContext";

import Navigation from "@/apps/Navigation/NavigationContainer";
import ExpensesNav from "@/apps/Navigation/ExpensesNav";
import HeaderContent from "@/apps/Header/HeaderContainer";
import PageLoader from "@/components/PageLoader";

import { settingsAction } from "@/redux/settings/actions";
import { currencyAction } from "@/redux/currency/actions";
import { translateAction } from "@/redux/translate/actions";
import { selectSettings } from "@/redux/settings/selectors";

import AppRouter from "@/router/AppRouter";

import useResponsive from "@/hooks/useResponsive";

import storePersist from "@/redux/storePersist";
import { selectLangDirection } from "@/redux/translate/selectors";

export default function ErpCrmApp() {
	const { Content } = Layout;

	const { state: stateApp, appContextAction } = useAppContext();
	const { app } = appContextAction;
	const { isNavMenuClose, currentApp } = stateApp;

	const { isMobile } = useResponsive();

	const dispatch = useDispatch();

	useLayoutEffect(() => {
        console.log("Dispatching settingsAction.list");
		dispatch(settingsAction.list({ entity: "setting" }));
		dispatch(currencyAction.list());
	}, [dispatch]);

	const appSettings = useSelector(selectAppSettings);
    console.log("App Settings:", appSettings); 

	const { isSuccess: settingIsloaded } = useSelector(selectSettings);
    console.log("Setting loaded state:", settingIsloaded);

	useEffect(() => {
		const { loadDefaultLang } = storePersist.get("firstVisit");
		if (appSettings.crm_erp_tool_app_language && !loadDefaultLang) {
			dispatch(
				translateAction.translate(appSettings.crm_erp_tool_app_language),
			);
			window.localStorage.setItem(
				"firstVisit",
				JSON.stringify({ loadDefaultLang: true }),
			);
		}
	}, [appSettings, dispatch]);
	const langDirection = useSelector(selectLangDirection);
    
	if (settingIsloaded)
		return (
			<Layout
				hasSider
				style={{
					flexDirection: langDirection === "rtl" ? "row-reverse" : "row",
				}}
			>
				{/* {currentApp === 'default' ? <Navigation /> : <ExpensesNav />} */}
				<Navigation />

				{isMobile ? (
					<Layout style={{ marginLeft: 0 }}>
						<HeaderContent />
						<Content
							style={{
								margin: "40px auto 30px",
								overflow: "initial",
								width: "100%",
								padding: "0 25px",
								maxWidth: "none",
							}}
						>
							<AppRouter />
						</Content>
					</Layout>
				) : (
					<Layout>
						<HeaderContent />
						<Content
							style={{
								margin: "40px auto 30px",
								overflow: "initial",
								width: "100%",
								padding: "0 50px",
								maxWidth: 1400,
							}}
						>
							<AppRouter />
						</Content>
					</Layout>
				)}
			</Layout>
		);
    return <PageLoader />;
}
