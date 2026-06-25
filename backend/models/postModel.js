const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        replies: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            text: {
                type: String,
                required: true
            },
            likes: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }],
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    taggedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
