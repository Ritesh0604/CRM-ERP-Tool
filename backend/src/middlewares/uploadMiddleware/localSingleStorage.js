const multer = require("multer");
const path = require("node:path");
const { slugify } = require("transliteration");

const fileFilter = require("./utils/localFileFilter");

const singleStorageUpload = ({
	entity,
	fileType = "default",
	uploadFieldName = "file",
	fieldName = "file",
}) => {
	const diskStorage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, `src/public/uploads/${entity}`);
		},
		filename: (req, file, cb) => {
			try {
				// fetching the file extension of the uploaded file
				const fileExtension = path.extname(file.originalname);
				const uniqueFileID = Math.random().toString(36).slice(2, 7); // generates unique ID of length 5

				let originalname = "";
				if (req.body.seotitle) {
					originalname = slugify(req.body.seotitle.toLocaleLowerCase()); // convert any language to English characters
				} else {
					originalname = slugify(
						file.originalname.split(".")[0].toLocaleLowerCase(),
					); // convert any language to English characters
				}

				const _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;

				const filePath = `public/uploads/${entity}/${_fileName}`;
				// saving file name and extension in request upload object
				req.upload = {
					fileName: _fileName,
					fieldExt: fileExtension,
					entity: entity,
					fieldName: fieldName,
					fileType: fileType,
					filePath: filePath,
				};

				req.body[fieldName] = filePath;

				cb(null, _fileName);
			} catch (error) {
				cb(error); // pass the error to the callback
			}
		},
	});

	const filterType = fileFilter(fileType);

	const multerStorage = multer({
		storage: diskStorage,
		fileFilter: filterType,
	}).single("file");
	return multerStorage;
};

module.exports = singleStorageUpload;
