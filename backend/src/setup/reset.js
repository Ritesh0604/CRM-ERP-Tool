require("dotenv").config({ path: ".env" });

const mongoose = require("mongoose");

async function deleteData() {
	// Connect to your MongoDB database
	await mongoose.connect(process.env.DATABASE);

	// Define models
	const models = [
		require("../models/coreModels/Admin"),
		require("../models/coreModels/AdminPassword"),
		require("../models/coreModels/Setting"),
		require("../models/coreModels/Email"),
		require("../models/appModels/Currency"),
	];

	// Delete documents from specified models
	for (const model of models) {
		await model.deleteMany();
		console.log(
			`👍 ${model.modelName} Deleted. To setup demo data, run npm run setup`,
		);
	}

	try {
		// Get all collection names
		const collections = await mongoose.connection.db
			.listCollections()
			.toArray();

		// Loop through all collections and drop them
		for (const collection of collections) {
			await mongoose.connection.db.dropCollection(collection.name);
			console.log(`👍 Collection ${collection.name} dropped.`);
		}

		console.log("👍 All collections have been dropped.");
	} catch (error) {
		console.error("❌ Error dropping collections:", error.message);
	} finally {
        await mongoose.connection.db.dropDatabase();
        console.log("👍 Database itself have been dropped.");
		await mongoose.disconnect();
		console.log("👍 Disconnected from database.");
	}
}

deleteData();
