const { emailVerification, passwordVerification } = require('@/emailTemplate/emailVerification');

const { Resend } = require('resend');

const sendMail = async ({
    email,
    name,
    link,
    crm_erp_tool_app_email,
    subject = 'Verify your email | CRM-ERP-Tool',
    type = 'emailVerification',
    emailToken,
}) => {
    const resend = new Resend(process.env.RESEND_API);

    const { data } = await resend.emails.send({
        from: crm_erp_tool,
        to: email,
        subject,
        html:
            type === 'emailVerification'
                ? emailVerification({ name, link, emailToken })
                : passwordVerification({ name, link }),
    });

    return data;
};

module.exports = sendMail;
