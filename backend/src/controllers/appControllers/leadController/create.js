const mongoose = require("mongoose");
const People = mongoose.model("People");
const Company = mongoose.model("Company");

const create = async (Model, req, res) => {
	if (req.body.type === "people") {
		if (!req.body.people) {
			return res.status(403).json({
				success: false,
				message: "Please select a people",
			});
		}
		const { firstname, lastname } = await People.findOne({
			_id: req.body.people,
			removed: false,
		}).exec();
		req.body.name = `${firstname} ${lastname}`;
		req.body.company = null;
	} else {
		if (!req.body.company) {
			return res.status(403).json({
				success: false,
				message: "Please select a company",
			});
		}
		const { name } = await Company.findOne({
			_id: req.body.company,
			removed: false,
		}).exec();
		req.body.name = name;
		req.body.people = null;
	}

	req.body.removed = false;
	const result = await new Model({
		...req.body,
	}).save();

	return res.status(200).json({
		success: true,
		result,
		message: "Successfully Created the document in Model ",
	});
};

module.exports = create;
