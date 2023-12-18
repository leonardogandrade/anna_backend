const fs = require('fs')
const path = require('path')
const { uploadFileS3, downloaddFileS3 } = require('../classes/s3')
const { clearVectorFolder, deleteAllDocuments } = require('../utils/os-operations')

async function upload(req, res) {
    // Clear vector folder fromprevious analyses and delete previous uploaded files
    // clearVectorFolder()
    // deleteAllDocuments()

    const multiPartFile = req.file
    const file = path.join(__dirname, '..', '..', 'uploads', 'documents', multiPartFile.filename)

    console.log(multiPartFile)

    // const result = await fs.readFile(file, 'utf-8', (error, data) => {
    //     uploadFileS3(multiPartFile.filename, data)
    // })
}

async function download(req, res) {
    const filename = req.query.filename

    try {
        downloaddFileS3(filename)
    } catch (error) {
        console.error(`error while downloading file from S3 bucket: ${error}`)
    }

    res.sendStatus(200)
}

module.exports = {
    upload,
    download
}