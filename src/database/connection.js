const mongoose = require('mongoose')

async function connect() {
    /**
     * This is a mongoDB connection method
     */
    try {
        await mongoose.connect('mongodb+srv://admin:admin@myatlasclusteredu.txfb1al.mongodb.net/eventEmitter?retryWrites=true&w=majority')
        console.log('MongoDB connection stablished successfully.')
    } catch (error) {
        throw new Error(`It was not possible to connect to mongoDB: ${error}`)
    }

}

module.exports = {
    connect
}