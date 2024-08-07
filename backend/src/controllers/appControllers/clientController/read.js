const { migrate } = require("./migrate");

const read = async (Model, req, res) => {
	const result = await Model.findOne({
		_id: req.params.id,
		removed: false,
	}).exec();

	if (!result) {
		return res.status(404).json({
			success: false,
			result: null,
			message: "No document found ",
		});
	}
	const migratedData = migrate(result);
	return res.status(200).json({
		success: true,
		result: migratedData,
		message: "We found this document ",
	});
};

module.exports = read;
