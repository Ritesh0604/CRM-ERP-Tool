// const mail = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         result: null,
//         message: 'Please Upgrade to Premium  Version to have full features',
//     });
// };

// module.exports = mail;

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { SendQuote } = require('@/emailTemplate/sendEmailTemplate'); // Assuming you have an email template for quotes
const { Resend } = require('resend'); // Assuming you have a mailing service configured

const QuoteModel = mongoose.model('Quote');

const sendMail = async (req, res) => {
    const { id } = req.params;

    try {
        const quote = await QuoteModel.findById(id).populate('client', 'email name').exec();

        if (!quote) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No quote found with id: ${id}`,
            });
        }

        const { email, name } = quote.client;
        const subject = `Your Quote from CRM-ERP-TOOL`;

        const pdfPath = path.join('path/to/pdf/storage', quote.pdf);

        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'PDF file not found',
            });
        }

        const resend = new Resend(process.env.RESEND_API);

        const { data } = await resend.emails.send({
            from: process.env.CRM_ERP_TOOL_EMAIL,
            to: email,
            subject,
            html: SendQuote({
                title: 'Quote from CRM-ERP-TOOL',
                name,
                time: new Date(quote.createdAt).toLocaleString(),
            }),
            attachments: [
                {
                    filename: path.basename(pdfPath),
                    path: pdfPath,
                },
            ],
        });

        return res.status(200).json({
            success: true,
            result: data,
            message: 'Quote sent successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error sending quote: ' + error.message,
        });
    }
};

module.exports = sendMail;
