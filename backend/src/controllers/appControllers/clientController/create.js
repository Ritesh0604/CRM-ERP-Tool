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
		const client = await Model.findOne({
			people: req.body.people,
			removed: false,
		});

		if (client) {
			return res.status(403).json({
				success: false,
				result: null,
				message: "Client Already Exist",
			});
		}

		const { firstname, lastname } = await People.findOneAndUpdate(
			{
				_id: req.body.people,
				removed: false,
			},
			{ isClient: true },
			{
				new: true,
				runValidators: true,
			},
		).exec();
		req.body.name = `${firstname} ${lastname}`;
		req.body.company = undefined;
	} else {
		if (!req.body.company) {
			return res.status(403).json({
				success: false,
				message: "Please select a company",
			});
		}
		const client = await Model.findOne({
			company: req.body.company,
			removed: false,
		});

		if (client) {
			return res.status(403).json({
				success: false,
				result: null,
				message: "Client Already Exist",
			});
		}
		const { name } = await Company.findOneAndUpdate(
			{
				_id: req.body.company,
				removed: false,
			},
			{ isClient: true },
			{
				new: true,
				runValidators: true,
			},
		).exec();
		req.body.name = name;
		req.body.people = undefined;
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
