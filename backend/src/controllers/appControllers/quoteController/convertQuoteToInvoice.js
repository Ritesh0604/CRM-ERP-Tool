// const convertQuoteToInvoice = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };

// module.exports = convertQuoteToInvoice;

const mongoose = require('mongoose');
const Quote = mongoose.model('Quote');
const Invoice = mongoose.model('Invoice');
const { increaseBySettingKey } = require('@/middlewares/settings');
const { calculate } = require('@/helpers');

const convertQuoteToInvoice = async (quoteId, adminId) => {
    try {
        // Fetch the quote to be converted
        const quote = await Quote.findById(quoteId).exec();

        if (!quote) {
            throw new Error(`Quote with id ${quoteId} not found.`);
        }

        // Ensure the quote is not already converted
        if (quote.converted) {
            throw new Error(`Quote with id ${quoteId} has already been converted.`);
        }

        // Calculate invoice totals
        let subTotal = 0, taxTotal = 0, total = 0;
        quote.items.forEach(item => {
            const itemTotal = calculate.multiply(item.quantity, item.price);
            subTotal = calculate.add(subTotal, itemTotal);
            item.total = itemTotal; // Update item total in place
        });

        taxTotal = calculate.multiply(subTotal, quote.taxRate / 100);
        total = calculate.add(subTotal, taxTotal);

        // Create new invoice object
        const newInvoice = new Invoice({
            createdBy: adminId,
            // number: /* Generate new invoice number */,
            // year: /* Extract year from date or use current year */,
            content: quote.content,
            // date: /* Use current date or quote date */,
            expiredDate: quote.expiredDate,
            client: quote.client,
            items: quote.items,
            taxRate: quote.taxRate,
            subTotal,
            taxTotal,
            total,
            currency: quote.currency,
            discount: quote.discount,
            notes: quote.notes,
            status: 'draft', // Initial status for new invoice
            pdf: '', // This will be updated later after PDF generation
        });

        // Save the new invoice
        const savedInvoice = await newInvoice.save();

        // Update quote to mark it as converted
        await Quote.findByIdAndUpdate(quoteId, { converted: true }).exec();

        // Increment invoice numbering
        increaseBySettingKey({
            settingKey: 'last_invoice_number',
        });

        return savedInvoice;
    } catch (error) {
        throw new Error(`Error converting quote to invoice: ${error.message}`);
    }
};

module.exports = convertQuoteToInvoice;
