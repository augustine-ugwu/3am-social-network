const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username must be unique'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'email must be unique'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'please enter a password']
    },
    profile_info: {
        type: String,
        required: [true, 'please enter a password']
    },
})

module.exports = mongoose.model('User', userSchema)