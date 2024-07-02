// const mongoose = require('mongoose');

// const update = async (Model, req, res) => {
//     // Find document by id and updates with the required fields
//     return res.status(200).json({
//         success: false,
//         result: null,
//         message: 'You cant update client once is created',
//     });
// };

// module.exports = update;

const mongoose = require('mongoose');

const People = mongoose.model('People');
const Company = mongoose.model('Company');

const update = async (Model, req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        let client = await Model.findOne(
            {
                _id: id,
                removed: false,
            }).exec();

        if (!client) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No client found by this id: ' + id,
            });
        }

        if (client.type === 'people' && updateData.people) {
            if (!updateData.people) {
                return res.status(403).json({
                    success: false,
                    message: 'Please select a people',
                });
            } else {
                let existingClient = await Model.findOne({
                    people: updateData.people,
                    removed: false,
                });

                if (existingClient && existingClient._id.toString() !== id) {
                    return res.status(403).json({
                        success: false,
                        result: null,
                        message: 'Another client with this people already exists',
                    });
                }

                let { firstname, lastname } = await People.findOneAndUpdate(
                    {
                        _id: updateData.people,
                        removed: false,
                    },
                    { isClient: true },
                    {
                        new: true,
                        runValidators: true,
                    }
                ).exec();

                updateData.name = firstname + ' ' + lastname;
                // updateData.company = undefined;
            }
        } else if (client.type === 'company' && updateData.company) {
            if (!updateData.company) {
                return res.status(403).json({
                    success: false,
                    message: 'Please select a company',
                });
            } else {
                let existingClient = await Model.findOne({
                    company: updateData.company,
                    removed: false,
                });

                if (existingClient && existingClient._id.toString() !== id) {
                    return res.status(403).json({
                        success: false,
                        result: null,
                        message: 'Another client with this company already exists',
                    });
                }

                let { name } = await Company.findOneAndUpdate(
                    {
                        _id: updateData.company,
                        removed: false,
                    },
                    { isClient: true },
                    {
                        new: true,
                        runValidators: true,
                    }
                ).exec();

                updateData.name = name;
                // updateData.people = undefined;
            }
        }

        updateData.updated = Date.now();
        let updatedClient = await Model.findOneAndUpdate(
            { _id: id, removed: false },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).exec();

        return res.status(200).json({
            success: true,
            result: updatedClient,
            message: 'Successfully updated the client',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error updating the client: ' + error.message,
        });
    }
};

module.exports = update;
