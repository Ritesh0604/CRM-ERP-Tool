const mongoose = require("mongoose");
const Model = mongoose.model("Invoice");
const custom = require("@/controllers/pdfControllers");
const { calculate } = require("@/helpers");
const schema = require("./schemaValidate");

const update = async (req, res) => {
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

	const previousInvoice = await Model.findOne({
		_id: req.params.id,
		removed: false,
	});

	const { credit } = previousInvoice;

	const { items = [], taxRate = 0, discount = 0 } = req.body;

	if (items.length === 0) {
		return res.status(400).json({
			success: false,
			result: null,
			message: "Items cannot be empty",
		});
	}

	// default
	let subTotal = 0;
	let taxTotal = 0;
	let total = 0;

	//Calculate the items array with subTotal, total, taxTotal
	items.map((item) => {
		const total = calculate.multiply(item.quantity, item.price);
		//sub total
		subTotal = calculate.add(subTotal, total);
		//item total
		item.total = total;
	});
	taxTotal = calculate.multiply(subTotal, taxRate / 100);
	total = calculate.add(subTotal, taxTotal);

	body.subTotal = subTotal;
	body.taxTotal = taxTotal;
	body.total = total;
	body.items = items;
	body.pdf = `invoice-${req.params.id}.pdf`;
	if (Object.prototype.hasOwnProperty.call(body, "currency")) {
		body.currency = undefined;
	}

	// Find document by id and updates with the required fields

	const paymentStatus =
		calculate.sub(total, discount) === credit
			? "paid"
			: credit > 0
				? "partially"
				: "unpaid";
	body.paymentStatus = paymentStatus;

	const result = await Model.findOneAndUpdate(
		{ _id: req.params.id, removed: false },
		body,
		{
			new: true, // return the new result instead of the old one
		},
	).exec();

	// Returning successful response

	return res.status(200).json({
		success: true,
		result,
		message: "we update this document ",
	});
};

module.exports = update;
