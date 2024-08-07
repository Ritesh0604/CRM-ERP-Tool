const mongoose = require("mongoose");

const Client = mongoose.model("Client");
const People = mongoose.model("People");

const remove = async (Model, req, res) => {
	const { id } = req.params;

	const client = await Client.findOne({
		company: id,
		removed: false,
	}).exec();

	if (client) {
		return res.status(400).json({
			success: false,
			result: null,
			message:
				"Cannot delete company if company attached to any people or he/she is client",
		});
	}

	const people = await People.findOne({
		company: id,
		removed: false,
	}).exec();

	if (people) {
		return res.status(400).json({
			success: false,
			result: null,
			message:
				"Cannot delete company if company attached to any people or he/she is client",
		});
	}

	const result = await Model.findOneAndUpdate(
		{ _id: id, removed: false },
		{
			$set: {
				removed: true,
			},
		},
	).exec();

	if (!result) {
		return res.status(404).json({
			success: false,
			result: null,
			message: `No people found by this id: ${id}`,
		});
	}
	return res.status(200).json({
		success: true,
		result,
		message: `Successfully Deleted the people by id: ${id}`,
	});
};

module.exports = remove;
