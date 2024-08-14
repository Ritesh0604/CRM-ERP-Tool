import SettingsSection from "../components/SettingsSection";
import UpdateSettingModule from "../components/UpdateSettingModule";
import SettingsForm from "./SettingsForm";
import useLanguage from "@/locale/useLanguage";

export default function MoneyFormatSettingsModule({ config }) {
	const translate = useLanguage();
	return (
		<UpdateSettingModule config={config}>
			<SettingsSection
				title={translate("Default Currency")}
				description={translate("Select Default Currency")}
			>
				<SettingsForm />
			</SettingsSection>
		</UpdateSettingModule>
	);
}
