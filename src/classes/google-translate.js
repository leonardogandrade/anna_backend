const projectId = 'react-296200';
const location = 'global';
const { deleteAllDocuments } = require('../utils/os-operations')
const fs = require('fs')
const path = require('path')

// Imports the Google Cloud Translation library
const { TranslationServiceClient } = require('@google-cloud/translate');

// Instantiates a client
const translationClient = new TranslationServiceClient();

async function translateText(text) {
    // Construct request
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode: 'pt-bt',
        targetLanguageCode: 'en',
    };

    // Run request
    const [response] = await translationClient.translateText(request);
    let translated = [];

    for (const translation of response.translations) {
        translated.push(translation.translatedText)
        // console.log(`Translation: ${translation.translatedText}`);
    }

    deleteAllDocuments()

    fs.writeFile('./uploads/documents/readme_EN.txt', translated.toString(), 'utf8', err => {
        if (err)
            throw new Error("Error")
    })

}

module.exports = {
    translateText,
}
