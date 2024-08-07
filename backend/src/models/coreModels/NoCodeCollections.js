const mongoose = require("mongoose");

const noCodeCollectionsSchema = new mongoose.Schema({
	removed: {
		type: Boolean,
		default: false,
	},
	enabled: {
		type: Boolean,
		default: true,
	},
	collectionId: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
	appId: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},

	pageUiParams: { type: mongoose.Schema.Types.Mixed },

	dataTableUiParams: { type: mongoose.Schema.Types.Mixed },
	formUiParams: { type: mongoose.Schema.Types.Mixed },
	removeUiParams: { type: mongoose.Schema.Types.Mixed },
	readUiParams: { type: mongoose.Schema.Types.Mixed },
	createUiParams: { type: mongoose.Schema.Types.Mixed },
	updateUiParams: { type: mongoose.Schema.Types.Mixed },

	readController: { type: mongoose.Schema.Types.Mixed },
	updateController: { type: mongoose.Schema.Types.Mixed },
	searchController: { type: mongoose.Schema.Types.Mixed },
	filterController: { type: mongoose.Schema.Types.Mixed },
	createController: { type: mongoose.Schema.Types.Mixed },
	removeController: { type: mongoose.Schema.Types.Mixed },
	listController: { type: mongoose.Schema.Types.Mixed },

	collectionParams: {
		searchConfig: {
			displayLabels: [String],
			searchFields: String,
			outputValue: {
				type: String,
				default: "_id",
			},
		},
		deleteModalLabels: [String],
	},

	collectionLabels: [
		{
			lang: { type: String, default: "en" },
			labels: {
				PANEL_TITLE: String,
				ENTITY_NAME: String,
				CREATE_ENTITY: String,
				ADD_NEW_ENTITY: String,
				UPDATE_ENTITY: String,
				DATATABLE_TITLE: String,
			},
		},
	],
	collectionSchema: [
		{
			fieldId: {
				type: String,
				trim: true,
				required: true,
				unique: true,
			},
			label: [
				{
					lang: {
						type: String,
						default: "en",
					},
					value: String,
				},
			],
			fieldType: {
				type: String,
				trim: true,
				required: true,
				default: "String",
			},
			refCollection: {
				type: String,
				trim: true,
			},
			refFields: {
				type: [String], // This defines an array of strings
			},
			isAutopopulate: {
				type: Boolean,
				default: false,
			},
			isAutoManaged: {
				create: {
					type: Boolean,
					default: false,
				},
				update: {
					type: Boolean,
					default: false,
				},
			},
			isEnabled: {
				type: Boolean,
				default: false,
			},
			isRemoved: {
				type: Boolean,
				default: false,
			},
			isRequired: {
				type: Boolean,
				default: false,
			},
			isLowercase: {
				type: Boolean,
				default: false,
			},
			isTrim: {
				type: Boolean,
				default: false,
			},
			default: {
				type: mongoose.Schema.Types.Mixed,
			},
			formField: {
				fieldType: {
					type: String,
					trim: true,
					required: true,
					lowercase: true,
					default: "text",
				},
				fieldDefaultValue: { type: mongoose.Schema.Types.Mixed },
				fieldOptions: { type: mongoose.Schema.Types.Mixed },
				isEnabledInCreate: {
					type: Boolean,
					default: true,
				},
				isEnabledInUpdate: {
					type: Boolean,
					default: true,
				},
				fieldOrder: {
					type: Number,
					required: true,
					default: 0,
				},
				uiParams: { type: mongoose.Schema.Types.Mixed },
			},
			dataTable: {
				cellType: {
					type: String,
					trim: true,
					required: true,
					lowercase: true,
					default: "text",
				},
				cellParams: { type: mongoose.Schema.Types.Mixed },
				cellUiParams: { type: mongoose.Schema.Types.Mixed },
				cellOrder: {
					type: Number,
					required: true,
					default: 0,
				},
				isHidden: {
					type: Boolean,
					default: false,
				},
			},
			readBox: {
				lineType: {
					type: String,
					trim: true,
					required: true,
					lowercase: true,
					default: "text",
				},
				lineParams: { type: mongoose.Schema.Types.Mixed },
				lineUiParams: { type: mongoose.Schema.Types.Mixed },
				lineOrder: {
					type: Number,
					required: true,
					default: 0,
				},
				isHidden: {
					type: Boolean,
					default: false,
				},
			},
		},
	],
});

module.exports = mongoose.model("NoCodeCollections", noCodeCollectionsSchema);
