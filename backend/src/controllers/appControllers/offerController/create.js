const mongoose = require("mongoose");

const Model = mongoose.model("Offer");

const custom = require("@/controllers/pdfControllers");
const { checkCurrency } = require("@/utils/currency");

const { calculate } = require("@/helpers");
const { increaseBySettingKey } = require("@/middlewares/settings");

const create = async (req, res) => {
	const { items = [], taxRate = 0, discount = 0, currency } = req.body;

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

	const body = req.body;

	body.subTotal = subTotal;
	body.taxTotal = taxTotal;
	body.total = total;
	body.items = items;
	body.createdBy = req.admin._id;

	const result = await new Model(body).save();
	const fileId = `offer-${result._id}.pdf`;
	const updateResult = await Model.findOneAndUpdate(
		{ _id: result._id },
		{ pdf: fileId },
		{ new: true },
	).exec();

	increaseBySettingKey({
		settingKey: "last_offer_number",
	});

	return res.status(200).json({
		success: true,
		result: updateResult,
		message: "Offer created successfully",
	});
};
module.exports = create;
