const listAllSettings = require('./listAllSettings');

const loadSettings = async () => {
    const allSettings = {};
    const data = await listAllSettings();
    data.forEach((settingKey, settingValue) => {
        allSettings[settingKey] = settingValue;
    });
    return allSettings;
};

module.exports = loadSettings;
