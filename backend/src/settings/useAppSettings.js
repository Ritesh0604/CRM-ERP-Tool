const useAppSettings = () => {
    let settings = {};
    // add resend email service mail for app
    settings['app_email'] = '';
    // add deployment base url
    settings['base_url'] = '';
    return settings;
};

module.exports = useAppSettings;
