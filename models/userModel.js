const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userid: {
        type: String,
        required: [true, 'username must be unique'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'email must be unique'],
        unique: true
    },
    fullname: {
        type: String,
        required: [true, 'please enter a password']
    },
    password: {
        type: String,
        required: [true, 'please enter a password']
    }
})

module.exports = mongoose.model('User', userSchema)