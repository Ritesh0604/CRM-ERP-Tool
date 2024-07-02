const mongoose = require('mongoose');
const Model = mongoose.model('Taxes');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Taxes');

delete methods['delete'];

methods.create = async (req, res) => {
    const { isDefault } = req.body;

    if (isDefault) {
        await Model.updateMany({}, { isDefault: false });
    }
    const countDefault = await Model.countDocuments({
        isDefault: true,
    });

    const result = await new Model({
        ...req.body,
        isDefault: countDefault < 1 ? true : false,
    }).save();

    return res.status(200).json({
        success: true,
        result: result,
        message: 'Tax created successfully',
    });
};

methods.delete = async (req, res) => {
    return res.status(403).json({
        success: false,
        result: null,
        message: "You can't delete tax after it has been created",
    });
};

methods.update = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedTax = await Model.findByIdAndUpdate(id, updates, { new: true }).exec();

        if (!updatedTax) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `Tax with id ${id} not found`,
            });
        }

        return res.status(200).json({
            success: true,
            result: updatedTax,
            message: 'Tax updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error updating tax: ' + error.message,
        });
    }
};

module.exports = methods;
