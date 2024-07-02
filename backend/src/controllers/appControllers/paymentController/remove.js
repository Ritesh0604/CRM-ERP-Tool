// const remove = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };
// module.exports = remove;

const mongoose = require('mongoose');
const PaymentModel = mongoose.model('Payment');

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await PaymentModel.findOne({ _id: id, removed: false }).exec();

        if (!payment) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No payment found by this id: ' + id,
            });
        }

        payment.removed = true;
        await payment.save();

        return res.status(200).json({
            success: true,
            result: payment,
            message: 'Payment removed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'An error occurred while removing the payment',
        });
    }
};

module.exports = remove;
