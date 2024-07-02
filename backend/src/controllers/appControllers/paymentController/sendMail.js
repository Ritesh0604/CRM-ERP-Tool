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
const { SendPayment } = require('@/emailTemplate/sendEmailTemplate');
const { Resend } = require('resend');

const PaymentModel = mongoose.model('Payment');

const sendMail = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await PaymentModel.findById(id).exec();
        if (!payment) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No payment found with id: ${id}`,
            });
        }

        const email = req.body.email || 'default@email.com'; // Replace with actual email field from request
        const subject = `Your Payment from CRM-ERP-TOOL`;

        const pdfPath = path.join('path/to/pdf/storage', payment.pdf);

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
            html: SendPayment({
                title: 'Payment from CRM-ERP-TOOL',
                amount: payment.amount,
                time: new Date(payment.createdAt).toLocaleString(),
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
            message: 'Payment details sent successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error sending payment details: ' + error.message,
        });
    }
};

module.exports = sendMail;
