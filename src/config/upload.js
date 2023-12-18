const { randomUUID } = require('crypto')
const multer = require('multer');
const path = require('path');
const fileSystem = path.join(__dirname, '..', '..', 'uploads', 'documents')
const { clearVectorFolder, deleteAllDocuments } = require('../utils/os-operations')

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(fileSystem),
        filename: function (req, file, cb) {
            const [name, ext] = file.originalname.split('.');
            deleteAllDocuments();
            clearVectorFolder()
            cb(null, `${randomUUID()}.${ext}`);
        }
    })
}