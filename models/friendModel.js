const mongoose = require('mongoose')

const connectSchema = mongoose.Schema({
    sent_from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sent_to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status:{
        type: String,
        enum: ['request', 'accepted', 'rejected'],
        default: 'request'
    }
    
}, {
    timestamps: true
})

module.exports = mongoose.model('Friend', connectSchema)