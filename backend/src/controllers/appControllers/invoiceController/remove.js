// const mongoose = require('mongoose');

// const Model = mongoose.model('Invoice');
// const ModalPayment = mongoose.model('Payment');

// const remove = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };

// module.exports = remove;

const mongoose = require('mongoose');

const InvoiceModel = mongoose.model('Invoice');
const PaymentModel = mongoose.model('Payment');

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        const invoice = await InvoiceModel.findOne({ _id: id, removed: false }).exec();

        if (!invoice) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No invoice found by this id: ' + id,
            });
        }

        const payments = await PaymentModel.find({ invoice: id }).exec();

        if (payments.length > 0) {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Cannot delete invoice with associated payments',
            });
        }

        invoice.removed = true;
        await invoice.save();

        return res.status(200).json({
            success: true,
            result: invoice,
            message: 'Invoice removed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while removing the invoice',
        });
    }
};

module.exports = remove;
