const bcrypt = require("bcryptjs");
const Joi = require("joi");
const mongoose = require("mongoose");
const { generate: uniqueId } = require("shortid");
const { loadSettings } = require("@/middlewares/settings");

const checkAndCorrectURL = require("./checkAndCorrectURL");
const sendMail = require("./sendMail");

const register = async (req, res, { userModel }) => {
	const settings = await loadSettings();

	const crm_erp_tool_registration_allowed =
		settings.crm_erp_tool_registration_allowed;
	const crm_erp_tool_app_email = settings.crm_erp_tool_app_email;
	const crm_erp_tool_base_url = settings.crm_erp_tool_base_url;

	if (!crm_erp_tool_registration_allowed) {
		return res.status(409).json({
			success: false,
			result: null,
			message:
				"Registration is not allowed, please contact application administrator",
		});
	}

	const UserPassword = mongoose.model(`${userModel}Password`);
	const User = mongoose.model(userModel);
	const { name, email, password } = req.body;

	// Validate input
	const objectSchema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string()
			.email({ tlds: { allow: true } })
			.required(),
		password: Joi.string().required(),
	});

	const { error, value } = objectSchema.validate({ name, email, password });
	if (error) {
		return res.status(409).json({
			success: false,
			result: null,
			error: error,
			message: "Invalid/Missing credentials.",
			errorMessage: error.message,
		});
	}

	const existingUser = await User.findOne({ email: email, removed: false });
	if (existingUser) {
		return res.status(409).json({
			success: false,
			result: null,
			message: "An account with this email has already been registered.",
		});
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const salt = uniqueId();
		const hashedPassword = bcrypt.hashSync(salt + password);
		const emailToken = uniqueId();

		// Create new user with enabled set to false initially
		const newUser = new User({
			email,
			name,
		});
		const savedUser = await newUser.save({ session });

		const registrationDone = await UserPassword.create(
			[
				{
					user: savedUser._id,
					password: hashedPassword,
					salt: salt,
					emailToken,
				},
			],
			{ session },
		);

		if (!registrationDone) {
			await session.abortTransaction();
			session.endSession();
			await User.deleteOne({ _id: savedUser._id }).exec();
			return res.status(403).json({
				success: false,
				result: null,
				message: "Document couldn't save correctly",
			});
		}

		const url = checkAndCorrectURL(crm_erp_tool_base_url);
		const link = `${url}/verify/${savedUser._id}/${emailToken}`;

		const sendMailResponse = await sendMail({
			email,
			name,
			link,
			crm_erp_tool_app_email,
			emailToken,
		});
		console.log("SendMail Response:", sendMailResponse);

		if (!sendMailResponse || sendMailResponse.error) {
			await session.abortTransaction();
			session.endSession();
			await User.deleteOne({ _id: savedUser._id }).exec();
			return res.status(500).json({
				success: false,
				result: null,
				message:
					"Failed to send email. User registration has been rolled back.",
			});
		}

		// Commit the transaction
		await session.commitTransaction();

		// Update user to set enabled to true
		await User.findByIdAndUpdate(savedUser._id, { enabled: true }, { session });

		session.endSession();

		return res.status(200).json({
			success: true,
			result: {
				_id: savedUser._id,
				name: savedUser.name,
				email: savedUser.email,
			},
			message: "Account registered successfully. Please verify your email.",
		});
	} catch (error) {
		console.error("Registration Error:", error);
		await session.abortTransaction();
		session.endSession();
		return res.status(500).json({
			success: false,
			message: "Failed to register user. Changes rolled back.",
			error: error.message,
		});
	}
};

module.exports = register;
