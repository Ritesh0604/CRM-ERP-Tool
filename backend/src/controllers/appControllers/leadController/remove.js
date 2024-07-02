// const mongoose = require('mongoose');

// const remove = async (Model, req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };
// module.exports = remove;

const mongoose = require('mongoose');

const remove = async (Model, req, res) => {
    const { id } = req.params;

    try {
        const document = await Model.findById(id).exec();
        if (!document) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No document found with id: ${id}`,
            });
        }

        // Perform additional checks or operations if needed

        // Soft delete by setting removed to true
        document.removed = true;
        const result = await document.save();

        return res.status(200).json({
            success: true,
            result,
            message: 'Document removed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error removing document: ' + error.message,
        });
    }
};

module.exports = remove;
