// const mongoose = require('mongoose');
// const Client = mongoose.model('Client');
// const Lead = mongoose.model('People');

// const update = async (Model, req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };

// module.exports = update;


const mongoose = require('mongoose');
const PeopleModel = mongoose.model('People');
const schema = require('./schemaValidate'); // Assuming you have a schema validation module

const update = async (req, res) => {
    const { id } = req.params;
    let body = req.body;

    // Validate request body
    const { error, value } = schema.validate(body);
    if (error) {
        const { details } = error;
        return res.status(400).json({
            success: false,
            result: null,
            message: details[0]?.message,
        });
    }

    try {
        const updatedPerson = await PeopleModel.findOneAndUpdate(
            { _id: id, removed: false },
            body,
            { new: true, runValidators: true }
        ).exec();

        if (!updatedPerson) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No person found with id: ${id}`,
            });
        }

        return res.status(200).json({
            success: true,
            result: updatedPerson,
            message: 'Person details updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error updating person details: ' + error.message,
        });
    }
};

module.exports = update;
