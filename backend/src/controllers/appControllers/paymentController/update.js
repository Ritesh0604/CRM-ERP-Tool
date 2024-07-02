// const update = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };

// module.exports = update;

const mongoose = require('mongoose');
const custom = require('@/controllers/pdfControllers');
const { calculate } = require('@/helpers');
const schema = require('./schemaValidate');

const PaymentModel = mongoose.model('Payment');

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
        const updatedPayment = await PaymentModel.findOneAndUpdate(
            { _id: id, removed: false },
            body,
            { new: true, runValidators: true }
        ).exec();

        if (!updatedPayment) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No payment found with id: ${id}`,
            });
        }

        const fileId = 'payment-' + updatedPayment._id + '.pdf';
        const targetLocation = `path/to/pdf/storage/${fileId}`;
        await custom.generatePdf('payment', { filename: fileId, format: 'A4', targetLocation }, updatedPayment, () => {
            updatedPayment.pdf = fileId;
            updatedPayment.save();
        });

        return res.status(200).json({
            success: true,
            result: updatedPayment,
            message: 'Payment details updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error updating payment details: ' + error.message,
        });
    }
};

module.exports = update;
