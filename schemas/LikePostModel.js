const mongoose = require('mongoose');

const likePostSchema = new mongoose.Schema({
    likedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    likedPost: {type: mongoose.Schema.Types.ObjectId, ref: "Post"}
}, {timestamps: true,toJSON: { virtuals: true }, toObject: { virtuals: true }})

likePostSchema.pre(/^find/, function(next) {
    this.populate({path:"user",select:"userName email"}).populate("post");
    next();
});

const LikePost = mongoose.model("LikePost", likePostSchema);
module.exports = LikePost;