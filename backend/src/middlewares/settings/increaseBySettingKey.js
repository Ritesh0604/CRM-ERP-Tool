const mongoose = require("mongoose");

const Model = mongoose.model("Setting");

const increaseBySettingKey = async ({ settingKey }) => {
	try {
		if (!settingKey) {
			return null;
		}

		const result = await Model.findByIdAndUpdate(
			{ settingKey },
			{
				$inc: { settingValue: 1 },
			},
			{
				new: true,
				runValidators: true,
			},
		).exec();

		if (!result) {
			return null;
		}
		return result;
	} catch {
		return null;
	}
};

module.exports = increaseBySettingKey;
