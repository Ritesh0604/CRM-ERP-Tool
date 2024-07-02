// const remove = async (Model, req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };
// module.exports = remove;

const mongoose = require('mongoose');
const PeopleModel = mongoose.model('People');
const CompanyModel = mongoose.model('Company');

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        const person = await PeopleModel.findOne({ _id: id, removed: false }).exec();

        if (!person) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No person found by this id: ' + id,
            });
        }

        // Check if person is attached to any company
        if (person.company) {
            const company = await CompanyModel.findOne({ _id: person.company }).exec();
            if (company) {
                return res.status(400).json({
                    success: false,
                    result: null,
                    message: 'Cannot delete person as they are attached to a company',
                });
            }
        }

        // Check if person is marked as client
        if (person.isClient) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Cannot delete person as they are marked as a client',
            });
        }

        person.removed = true;
        await person.save();

        return res.status(200).json({
            success: true,
            result: person,
            message: 'Person removed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while removing the person',
        });
    }
};

module.exports = remove;
