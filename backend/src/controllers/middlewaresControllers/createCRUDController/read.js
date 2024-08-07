const read = async (Model, req, res) => {
	// Find document by id
	const result = await Model.findOne({
		_id: req.params.id,
		removed: false,
	}).exec();

	// If no results found, return document not found
	if (!result) {
		return res.status(404).json({
			success: false,
			result: null,
			message: "No document found ",
		});
	}
	// Return success response
	return res.status(200).json({
		success: true,
		result,
		message: "We found this document ",
	});
};

module.exports = read;
