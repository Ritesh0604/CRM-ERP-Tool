import SettingsSection from "../components/SettingsSection";
import UpdateSettingModule from "../components/UpdateSettingModule";
import GeneralSettingForm from "./forms/GeneralSettingForm";
import useLanguage from "@/locale/useLanguage";

export default function GeneralSettingsModule({ config }) {
	const translate = useLanguage();
	return (
		<UpdateSettingModule config={config}>
			<SettingsSection
				title={translate("App Settings")}
				description={translate("Update your app configuration")}
			>
				<GeneralSettingForm />
			</SettingsSection>
		</UpdateSettingModule>
	);
}
