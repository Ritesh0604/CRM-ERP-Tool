const mongoose = require('mongoose');

const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');
const People = mongoose.model('People');
const Company = mongoose.model('Company');

const remove = async (Model, req, res) => {

    const { id } = req.params;

    const resultQuotes = QuoteModel.findOne({
        client: id,
        removed: false,
    }).exec();

    const resultInvoice = InvoiceModel.findOne({
        client: id,
        removed: false,
    }).exec();

    const [quotes, invoice] = await Promise.allSettled([resultQuotes, resultInvoice]);

    if (quotes?.value) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Cannot delete client if client have any quote  or invoice',
        });
    }

    if (invoice?.value) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Cannot delete client if client have any quote or invoice',
        });
    }

    let result = await Model.findOneAndDelete({
        _id: id,
        removed: false,
    }).exec();

    if (!result) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'No client found by this id: ' + id,
        });
    }

    if (result.type === 'people') {
        await People.findOneAndUpdate(
            {
                _id: result.people._id,
                removed: false,
            },
            { isClient: false },
            {
                new: true,
                runValidators: true,
            }
        ).exec();
    } else {
        await Company.findOneAndUpdate(
            {
                _id: result.company._id,
                removed: false,
            },
            { isClient: false },
            {
                new: true,
                runValidators: true,
            }
        ).exec();
    }

    return res.status(200).json({
        success: true,
        result: null,
        message: 'Successfully Deleted the client by id: ' + id,
    });
};
module.exports = remove;