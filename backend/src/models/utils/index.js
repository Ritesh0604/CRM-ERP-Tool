const { basename, extname } = require('path');
const { globSync } = require('glob');

const appModelFiles = globSync('./src/models/appModels/**/*.js');

const pattern = './src/models/**/*.js';

const modelsFiles = globSync(pattern).map((filePath) => {
    const fileNameWithExtension = basename(filePath);
    const fileNameWithoutExtension = fileNameWithExtension.replace(
        extname(fileNameWithExtension),
        ''
    );
    return fileNameWithoutExtension;
})

const controllersList = [];
const appModelList = [];
const entityList = [];
const routeList = [];

for (const filePath of appModelFiles) {
    const fileNameWithExtension = basename(filePath);
    const fileNameWithoutExtension = fileNameWithExtension.replace(
        extname(fileNameWithExtension),
        ''
    );
    const firstChar = fileNameWithoutExtension.charAt(0);
    const modelName = fileNameWithoutExtension.replace(firstChar, firstChar.toUpperCase());
    const fileNameLowerCaseFirstChar = fileNameWithoutExtension.replace(
        firstChar,
        firstChar.toLowerCase()
    );
    const entity = fileNameWithoutExtension.toLowerCase();

    const controllerName = fileNameLowerCaseFirstChar + 'Controller';
    controllersList.push(controllerName);
    appModelList.push(modelName);
    entityList.push(entity);

    const route = {
        entity: entity,
        modelName: modelName,
        controllersName: controllerName,
    };
    routeList.push(route);
}

module.exports = { controllersList, appModelList, modelsFiles, entityList, routeList };
