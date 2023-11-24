const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({

    postContent: {
        type: String,
        required: true
    },
    postCreatorEmail: {
        type: String,
        required: true
    },
    postCreationDateTime: {
        type: Date,
        required: true
    },
    postImage: {
        type: String,
        required: false
    },
    postLikeCount: {
        type: Number,
        required: true,
        default: 0
    }

})

const post = mongoose.model('post', postSchema)
module.exports = post

