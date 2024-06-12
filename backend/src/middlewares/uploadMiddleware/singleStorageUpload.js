const multer = require('multer');
const path = require('path');
const { slugify } = require('transliteration');

const fileFilter = require('./utils/localFileFilter');

const singleStorageUpload = ({
    entity,
    fileType = 'default',
    uploadFieldNam = 'file',
    fieldName = 'file',
}) => {
    var diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `src/public/uploads/${entity}`);
        },
        filename: function (req, file, cb) {
            try {
                let fileExtension = path.extname(file.originalname);
                let uniqueFileId = Math.random().toString(36).slice(2, 7);

                let originalname = '';
                if (req.body.seotitle) {
                    originalname = slugify(req.body.seotitle.toLocaleLowerCase());
                } else {
                    originalname = slugify(file.originalname.split('.')[0].toLocaleLowerCase());
                }

                let _fileName = `${originalname}-${uniqueFileId}${fileExtension}`;

                const filePath = `public/uploads/${entity}/${_fileName}`;

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
                cb(error);
            }
        },
    });

    let filterType = fileFilter(fileType);

    const multerStorage = multer({
        storage: diskStorage,
        fileFilter: filterType
    }).single('uploadFieldNam');
    return multerStorage;
};

module.exports = singleStorageUpload;
