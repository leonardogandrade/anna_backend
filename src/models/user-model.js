const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    roleDescription: String
})

module.exports = mongoose.model('User', userSchema);
