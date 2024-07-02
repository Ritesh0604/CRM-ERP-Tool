// const updateBySettingKey = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };

// module.exports = updateBySettingKey;

const mongoose = require('mongoose');
const Setting = mongoose.model('Setting');

const updateBySettingKey = async (req, res) => {
    const { settingKey } = req.params;
    const { settingValue } = req.body;

    try {
        if (!settingKey) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Setting key not provided',
            });
        }

        const updatedSetting = await Setting.findOneAndUpdate(
            { settingKey },
            { settingValue },
            { new: true }
        );

        if (!updatedSetting) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `Setting with key ${settingKey} not found`,
            });
        }

        return res.status(200).json({
            success: true,
            result: updatedSetting,
            message: 'Setting updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error updating setting: ' + error.message,
        });
    }
};

module.exports = updateBySettingKey;
