const fs = require('fs')
const path = require('path')

const clearVectorFolder = () => {
    const vectorFolder = path.join(__dirname, '..', '..', 'uploads', 'documents', 'vectors')
    fs.readdir(vectorFolder, 'utf-8', (error, files) => {
        if (error)
            throw new Error(`error deleting file: ${error}`)

        files.forEach(file => {
            fs.unlink(path.join(vectorFolder, file), error => {
                if (error)
                    throw new Error(`error deleting file: ${error}`)
            })
        })
    })
}

const deleteAllDocuments = () => {
    const vectorFolder = path.join(__dirname, '..', '..', 'uploads', 'documents')
    fs.readdir(vectorFolder, 'utf-8', (error, files) => {
        if (error)
            throw new Error(`error deleting file: ${error}`)

        files.forEach(file => {
            if (file != 'vectors')
                fs.unlink(path.join(vectorFolder, file), error => {
                    if (error)
                        throw new Error(`error deleting file: ${error}`)
                })
        })
    })
}

const vectorFilesExists = () => {
    const vectorFolder = path.join(__dirname, '..', '..', 'uploads', 'documents')
    const vectorFiles = ['args.json', 'docstore.json', 'hnswlib.index']
    let verify = 0

    vectorFiles.forEach(file => {
        if (fs.readdirSync(vectorFolder).includes(file))
            verify += 1
    })

    return verify
}


module.exports = {
    clearVectorFolder,
    deleteAllDocuments,
    vectorFilesExists
}
