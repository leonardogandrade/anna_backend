const { askOwnDocuments } = require('../classes/chat-own-documents')

async function chat(req, res) {
    const { question } = req.body
    const response = await askOwnDocuments(question)
    res.json(response)
}

module.exports = {
    chat
}