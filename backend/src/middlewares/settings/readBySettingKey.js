const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const readBySettingKey = async ({ settingKey }) => {
    try {
        if (!settingKey) {
            return null;
        }

        const result = await Model.findOne({ settingKey });

        if (!result) {
            return null;
        } else {
            return result;
        }
    } catch {
        return null;
    }
};

module.exports = readBySettingKey;
