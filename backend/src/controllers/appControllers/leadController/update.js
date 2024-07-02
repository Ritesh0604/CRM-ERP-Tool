// const mongoose = require('mongoose');
// const People = mongoose.model('People');
// const Company = mongoose.model('Company');

// const update = async (Model, req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };

// module.exports = update;

const mongoose = require('mongoose');
const People = mongoose.model('People');
const Company = mongoose.model('Company');

const update = async (Model, req, res) => {
    const { id } = req.params;

    try {
        let document = await Model.findById(id).exec();
        if (!document) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No document found with id: ${id}`,
            });
        }

        // Update fields based on request body
        if (req.body.type === 'people') {
            if (!req.body.people) {
                return res.status(403).json({
                    success: false,
                    message: 'Please select a people',
                });
            } else {
                let { firstname, lastname } = await People.findOne({
                    _id: req.body.people,
                    removed: false,
                }).exec();
                req.body.name = firstname + ' ' + lastname;
                req.body.company = null;
            }
        } else {
            if (!req.body.company) {
                return res.status(403).json({
                    success: false,
                    message: 'Please select a company',
                });
            } else {
                let { name } = await Company.findOne({
                    _id: req.body.company,
                    removed: false,
                }).exec();
                req.body.name = name;
                req.body.people = null;
            }
        }

        // Update document fields
        Object.keys(req.body).forEach((key) => {
            document[key] = req.body[key];
        });

        document.updated = Date.now();

        const result = await document.save();

        return res.status(200).json({
            success: true,
            result,
            message: 'Document updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error updating document: ' + error.message,
        });
    }
};

module.exports = update;
