const mongoose = require('mongoose')
const User = mongoose.model('User')

const addUser = (req, res) => {
    // const { username, password, roleDescription } = req.body
    // const result = await User.create({
    //     username,
    //     password,
    //     roleDescription
    // })

    res.json(req.body)
}

module.exports = {
    addUser
}