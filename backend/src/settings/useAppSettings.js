const useAppSettings = () => {
	const settings = {};
	// add resend email service mail for app
	settings.app_email = "onboarding@resend.dev";
	// add deployment base url
	settings.base_url = "http://localhost:3000/";
	return settings;
};

module.exports = useAppSettings;
