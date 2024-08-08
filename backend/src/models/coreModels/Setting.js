const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
	removed: {
		type: Boolean,
		default: false,
	},
	enabled: {
		type: Boolean,
		default: true,
	},
	settingCategory: {
		type: String,
		required: true,
		lowercase: true,
	},
	settingKey: {
		type: String,
		unique: true,
		lowercase: true,
		required: true,
	},
	settingValue: {
		type: mongoose.Schema.Types.Mixed,
		required: true,
	},
	valueType: {
		type: String,
		default: "String",
	},
	isPrivate: {
		type: Boolean,
		default: false,
	},
	isCoreSetting: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Setting", settingSchema);
