const { model, Schema } = require("mongoose");

const postSchema = new Schema({
    body: String,
    imageUrl: String,
    username: String,
    createdAt: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    likes: [
        {
            username: String,
            createdAt: String,
        },
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    imageURL: String,
    isComment: Boolean,
    replyingTo: Schema.Types.ObjectId,
});

module.exports = model("Post", postSchema);
