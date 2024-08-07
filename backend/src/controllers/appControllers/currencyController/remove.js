const mongoose = require("mongoose");

const remove = async (Model, req, res) => {
	return res.status(400).json({
		success: false,
		result: null,
		message: "Cannot remove currency after was created",
	});
};
module.exports = remove;
