const express = require('express')
const server = express()
const cors = require('cors')
require('require-dir')('./src/models')
const routes = require('./src/routes')
const { connect } = require('./src/database/connection')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./docs/swagger_output.json')
const { clearVectorFolder, deleteAllDocuments } = require('./src/utils/os-operations')

const PORT = 3007

// JSON Parser
server.use(express.json())
server.use(cors())

// Cleanup the enrinment
console.log('cleanup the enrinment...')
// clearVectorFolder()
// deleteAllDocuments()

// Database connection
connect()

server.use('/api', routes)
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

server.listen(PORT, error => {
    if (!error)
        console.log(`Application running on ${PORT}`)

    return
})
