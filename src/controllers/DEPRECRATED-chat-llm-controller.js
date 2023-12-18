const { runModel } = require('../classes/palm2')

async function chat(req, res) {
    const { question } = req.body
    const response = await runModel(question)
    res.json(response)
}

module.exports = {
    chat
}