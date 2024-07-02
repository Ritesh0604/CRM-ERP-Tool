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
const { SendOffer } = require('@/emailTemplate/sendEmailTemplate');
const { Resend } = require('resend');

const OfferModel = mongoose.model('Offer');
const LeadModel = mongoose.model('Lead'); // Assuming Lead model has customer details

const sendMail = async (req, res) => {
    const { id } = req.params;

    try {
        const offer = await OfferModel.findById(id).exec();
        if (!offer) {
            return res.status(404).json({
                success: false,
                result: null,
                message: `No offer found with id: ${id}`,
            });
        }

        let customerName = 'Customer'; // Default customer name if not found

        // Fetch customer name from related Lead
        if (offer.lead) {
            const lead = await LeadModel.findById(offer.lead).exec();
            if (lead) {
                customerName = lead.name; // Assuming customer's name is stored in lead.name
            }
        }

        const email = req.body.email || 'default@email.com'; // Replace with actual email field from request
        const subject = `Your Offer from CRM-ERP-TOOL`;

        const pdfPath = path.join('path/to/pdf/storage', offer.pdf);

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
            html: SendOffer({
                title: 'Offer from CRM-ERP-TOOL',
                name: customerName, // Use dynamic customer name here
                time: new Date(offer.createdAt).toLocaleString(),
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
            message: 'Offer sent successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Error sending offer: ' + error.message,
        });
    }
};

module.exports = sendMail;

