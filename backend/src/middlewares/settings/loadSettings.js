const listAllSettings = require("./listAllSettings");

const loadSettings = async () => {
	const allSettings = {};
	const data = await listAllSettings();
	for (const setting of data) {
		if (setting.settingKey && setting.settingValue !== undefined) {
			allSettings[setting.settingKey] = setting.settingValue;
		}
	}
	return allSettings;
};

module.exports = loadSettings;
