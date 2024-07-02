// const fs = require('fs');

// const mongoose = require('mongoose');

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
const { SendInvoice } = require('@/emailTemplate/sendEmailTemplate');
const { Resend } = require('resend');

const InvoiceModel = mongoose.model('Invoice');

const sendMail = async (req, res) => {
    const { id } = req.params;

    try {
        const invoice = await InvoiceModel.findById(id).exec();
        if (!invoice) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No invoice found with id: ${id}`,
            });
        }

        const email = req.body.email || invoice.customerEmail;
        const name = invoice.customerName;
        const subject = `Your Invoice from CRM-ERP-TOOL`;

        const pdfPath = path.join('path/to/pdf/storage', invoice.pdf);

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
            html: SendInvoice({
                title: 'Invoice from CRM-ERP-TOOL',
                name,
                time: new Date(invoice.createdAt).toLocaleString(),
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
            message: 'Invoice sent successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error sending invoice: ' + error.message,
        });
    }
};

module.exports = sendMail;
