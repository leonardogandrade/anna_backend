const fs = require('fs')
const path = require('path')
const Crawler = require('crawler');
const { translateText } = require('../classes/google-translate')
const { uploadFileS3, downloaddFileS3 } = require('../classes/s3')
const { clearVectorFolder, deleteAllDocuments } = require('../utils/os-operations')

async function upload(req, res) {
    const multiPartFile = req.file
    const file = path.join(__dirname, '..', '..', 'uploads', 'documents', multiPartFile.filename)


    console.log(multiPartFile)

    // const result = await fs.readFile(file, 'utf-8', (error, data) => {
    //     uploadFileS3(multiPartFile.filename, data)
    // })
    if (multiPartFile.size)
        res.status(200).json({ msg: 'ok' })
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

async function webScrap(req, res) {
    const c = new Crawler({
        maxConnections: 10,
        jquery: false,
        // This will be called for each crawled page
        callback: (error, res, done) => {
            if (error) {
                console.log(error);
            } else {
                const result = res.body
                translateText(result)
            }
            done();
        }
    });
    const { repoName } = req.body

    const prefix = "https://raw.githubusercontent.com"
    const _repoName = repoName.split("/").slice()
    const repoOwner = _repoName.slice(_repoName.length - 2,)
    const sufix = "master/README.md"

    const rawRepoReadme = `${prefix}/${repoOwner[0]}/${repoOwner[1]}/${sufix}`

    // Queue just one URL, with default callback
    c.queue(rawRepoReadme);

    res.json({ repoName })

}

module.exports = {
    upload,
    download,
    webScrap,
}