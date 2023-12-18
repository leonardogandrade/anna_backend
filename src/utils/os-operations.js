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

module.exports = {
    clearVectorFolder,
    deleteAllDocuments
}
