const mongoose = require("mongoose");
const Client = mongoose.model("Client");
const Lead = mongoose.model("People");

const update = async (Model, req, res) => {
	req.body.removed = false;
	const result = await Model.fineOneAndUpdate(
		{
			_id: req.params.id,
			removed: false,
		},
		req.body,
		{
			new: true,
			runValidators: true,
		},
	).exec();

	if (!result) {
		return res.status(404).json({
			success: false,
			result: null,
			message: "No document found",
		});
	}
	await Client.findOneAndUpdate(
		{ company: result._id },
		{ name: result.name },
		{ new: true },
	).exec();

	await Lead.findOneAndUpdate(
		{ company: result._id },
		{ name: result.name },
		{ new: true },
	).exec();

	return res.status(200).json({
		success: true,
		result,
		message: "We update this document ",
	});
};

module.exports = update;
