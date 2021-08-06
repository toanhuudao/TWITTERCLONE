const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {type: String, required: true, trim: true},
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    pinned: {type: Boolean, default: false},

}, {
    timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}
})

const Post = mongoose.model("Post", postSchema);

postSchema.virtual("likedBy", {
    ref: "LikePost",
    foreignField: "likedPost",
    localField: "_id",
    options: {sort: {createAt: 1}}
});

module.exports = Post;

