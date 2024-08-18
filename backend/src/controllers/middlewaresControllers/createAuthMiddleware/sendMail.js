const {
	emailVerification,
	passwordVerification,
} = require("@/emailTemplate/emailVerification");

const { Resend } = require("resend");

const sendMail = async ({
	email,
	name,
	link,
	crm_erp_tool_app_email,
	subject = "Verify your email | CRM-ERP-Tool",
	type = "emailVerification",
	emailToken,
}) => {
	const resend = new Resend(process.env.RESEND_API);

	try {
		const response = await resend.emails.send({
			from: crm_erp_tool_app_email,
			to: email,
			subject,
			html:
				type === "emailVerification"
					? emailVerification({ name, link, emailToken })
					: passwordVerification({ name, link }),
		});
		console.log("SendMail Response:", response); // Log response details
		return response.data;
	} catch (error) {
		console.error("Error sending email:", error);
		return null;
	}
};

module.exports = sendMail;
