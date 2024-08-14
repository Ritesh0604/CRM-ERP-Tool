const mongoose = require("mongoose");

const createCRUDController = require("@/controllers/middlewaresControllers/createCRUDController");
const { routeList } = require("@/models/utils");

const { globSync } = require("glob");
const path = require("node:path");

const pattern = "./src/controllers/appControllers/*/**/";
const controllerDirectories = globSync(pattern).map((filePath) => {
	return path.basename(filePath);
});

const appControllers = () => {
	const controllers = {};
	const hasCustomControllers = [];

	for (const controllerName of controllerDirectories) {
		try {
			const customController = require(
				`@/controllers/appControllers/${controllerName}`,
			);

			if (customController) {
				hasCustomControllers.push(controllerName);
				controllers[controllerName] = customController;
			}
		} catch (err) {
			throw new Error(`This is the error: ${err.message}`);
		}
	}

	for (const { modelName, controllerName } of routeList) {
		if (!hasCustomControllers.includes(controllerName)) {
			controllers[controllerName] = createCRUDController(modelName);
		}
	}

	return controllers;
};

module.exports = appControllers();
