// const updateManySetting = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };

// module.exports = updateManySetting;

const mongoose = require('mongoose');
const Setting = mongoose.model('Setting');

const updateManySetting = async (req, res) => {
    const { updates } = req.body;

    try {
        if (!updates || !Array.isArray(updates)) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Invalid updates array provided',
            });
        }

        // Assuming updates is an array of objects with keys: settingKey, settingValue
        const bulkOperations = updates.map(update => ({
            updateOne: {
                filter: { settingKey: update.settingKey },
                update: { settingValue: update.settingValue },
                upsert: true, // Create new document if settingKey doesn't exist
            }
        }));

        const bulkResult = await Setting.bulkWrite(bulkOperations);

        return res.status(200).json({
            success: true,
            result: bulkResult,
            message: 'Settings updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error updating settings: ' + error.message,
        });
    }
};

module.exports = updateManySetting;
