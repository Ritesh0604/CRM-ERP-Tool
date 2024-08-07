require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE);

async function deleteData() {
	const Admin = require("../models/coreModels/Admin");
	const AdminPassword = require("../models/coreModels/AdminPassword");
	const Setting = require("../models/coreModels/Setting");
	const Email = require("../models/coreModels/Email");
	const Currency = require("../models/appModels/Currency");

	await Admin.deleteMany();
	await AdminPassword.deleteMany();
	console.log(
		"👍 Admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n",
	);
	await Setting.deleteMany();
	console.log(
		"👍 Setting Deleted. To setup Setting data, run\n\n\t npm run setup\n\n",
	);
	await Currency.deleteMany();
	console.log(
		"👍 Currency Deleted. To setup Currency data, run\n\n\t npm run setup\n\n",
	);
	await Email.deleteMany();
	console.log(
		"👍 Email Deleted. To setup Email data, run\n\n\t npm run setup\n\n",
	);

	// try {
	//     // Get all collection names
	//     const collections = await mongoose.connection.db.collections();

	//     // Loop through all collections and delete documents
	//     for (let collection of collections) {
	//         await collection.deleteMany();
	//         console.log(`👍 All documents deleted from collection ${collection.collectionName}`);
	//     }
	//     console.log('👍 All collections have been cleared.');
	// } catch (error) {
	//     console.error('❌ Error deleting collections:', error.message);
	// } finally {
	//     await mongoose.disconnect();
	// }
}

deleteData();
