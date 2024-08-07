const {
	afterRegistrationSuccess,
} = require("@/emailTemplate/emailVerification");

const { Resend } = require("resend");

const sendOffer = async ({ email, name }) => {
	const resend = new Resend(process.env.RESEND_API);

	const { data } = await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: "Customize CRM ERP Tool",
		html: afterRegistrationSuccess({ name }),
	});

	return data;
};

module.exports = sendOffer;
