// const mongoose = require('mongoose');

// const Model = mongoose.model('Invoice');

// const custom = require('@/controllers/pdfController');

// const { calculate } = require('@/helpers');
// const schema = require('./schemaValidate');

// const update = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium Version to have full features',
//     });
// };

// module.exports = update;

const mongoose = require('mongoose');
const custom = require('@/controllers/pdfControllers');
const { calculate } = require('@/helpers');
const schema = require('./schemaValidate');

const Model = mongoose.model('Invoice');

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

    const { items = [], taxRate = 0, discount = 0 } = value;

    let subTotal = 0, taxTotal = 0, total = 0;

    items.map((item) => {
        let total = calculate.multiply(item['quantity'], item['price']);
        subTotal = calculate.add(subTotal, total);
        item['total'] = total;
    });

    taxTotal = calculate.multiply(subTotal, taxRate / 100);
    total = calculate.add(subTotal, taxTotal);

    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;

    let paymentStatus = calculate.sub(total, discount) === 0 ? 'paid' : 'unpaid';
    body['paymentStatus'] = paymentStatus;
    body['updated'] = Date.now();

    try {
        const updatedInvoice = await Model.findOneAndUpdate(
            { _id: id, removed: false },
            body,
            { new: true, runValidators: true }
        ).exec();

        if (!updatedInvoice) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No invoice found with id: ${id}`,
            });
        }

        const fileId = 'invoice-' + updatedInvoice._id + '.pdf';
        const targetLocation = `path/to/pdf/storage/${fileId}`;
        await custom.generatePdf('invoice', { filename: fileId, format: 'A4', targetLocation }, updatedInvoice, () => {
            updatedInvoice.pdf = fileId;
            updatedInvoice.save();
        });

        return res.status(200).json({
            success: true,
            result: updatedInvoice,
            message: 'Invoice updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error updating invoice: ' + error.message,
        });
    }
};

module.exports = update;
