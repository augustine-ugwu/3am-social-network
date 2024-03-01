const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        require: [true, 'please add a post']
    },
    content: {
        type: String,
        require: [true, 'please add a post']
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema)