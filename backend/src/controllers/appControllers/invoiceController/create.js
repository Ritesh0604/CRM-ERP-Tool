const mongoose = require("mongoose");

const Model = mongoose.model("Invoice");
const { checkCurrency } = require("@/utils/currency");

const { calculate } = require("@/helpers");
const { increaseBySettingKey } = require("@/middlewares/settings");
const schema = require("./schemaValidate");

const create = async (req, res) => {
	const body = req.body;

	const { error, value } = schema.validate(body);
	if (error) {
		const { details } = error;
		return res.status(400).json({
			success: false,
			result: null,
			message: details[0]?.message,
		});
	}

	const { items = [], taxRate = 0, discount = 0, currency } = value;

	let subTotal = 0;
	let taxTotal = 0;
	let total = 0;

	if (!checkCurrency(currency)) {
		return res.status(400).json({
			success: false,
			result: null,
			message: "currency doesn't exist",
		});
	}

	items.map((item) => {
		const total = calculate.multiply(item.quantity, item.price);
		subTotal = calculate.add(subTotal, total);
		item.total = total;
	});

	taxTotal = calculate.multiply(subTotal, taxRate / 100);
	total = calculate.add(subTotal, taxTotal);

	body.subTotal = subTotal;
	body.taxTotal = taxTotal;
	body.total = total;
	body.items = items;

	const paymentStatus =
		calculate.sub(total, discount) === 0 ? "paid" : "unpaid";

	body.paymentStatus = paymentStatus;
	body.createdBy = req.admin._id;

	const result = await new Model(body).save();
	const fileId = `invoice-${result._id}.pdf`;
	const updateResult = await Model.findOneAndUpdate(
		{ _id: result._id },
		{ pdf: fileId },
		{ new: true },
	).exec();

	increaseBySettingKey({
		settingKey: "last_invoice_number",
	});

	return res.status(200).json({
		success: true,
		result: updateResult,
		message: "Invoice created successfully",
	});
};

module.exports = create;
