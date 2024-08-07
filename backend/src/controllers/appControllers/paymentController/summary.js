const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Payment');
const { loadSettings } = require('@/middlewares/settings');
const { checkCurrency } = require('@/utils/currency');

const summary = async (req, res) => {
    let defaultType = 'month';
    const { type, currency } = req.query;

    const settings = await loadSettings();

    const currentCurrency = currency
        ? currency.toUpperCase()
        : settings.default_currency_code.toUpperCase();

    if (type) {
        if (['week', 'month', 'year'].includes(type)) {
            defaultType = type;
        } else {
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Invalid type',
            });
        }
    }

    const currentDate = moment();
    const startDate = currentDate.clone().startOf(defaultType);
    const endDate = currentDate.clone().endOf(defaultType);

    const result = await Model.aggregate([
        {
            $match: {
                removed: false,
                currency: currentCurrency,
                // date: {
                //   $gte: startDate.toDate(),
                //   $lte: endDate.toDate(),
                // },
            },
        },
        {
            $group: {
                _id: null,
                count: {
                    $sum: 1,
                },
                total: {
                    $sum: '$amount',
                },
            },
        },
        {
            $project: {
                _id: 0,
                count: 1,
                total: 1,
            },
        },
    ]);

    return res.status(200).json({
        success: true,
        result: result.length > 0 ? result[0] : { count: 0, total: 0 },
        message: `Successfully fetched the summary of payment invoices for the last ${defaultType}`,
    });
};

module.exports = summary;
