const mongoose = require('mongoose');

const likePostSchema = new mongoose.Schema({
    likedBy: {type: mongoose.Schema.ObjectId, ref: "User"},
    likedPost: {type: mongoose.Schema.ObjectId, ref: "Post"}
}, {timestamps: true,toJSON: { virtuals: true }, toObject: { virtuals: true }})

likePostSchema.pre(/^find/, function(next) {
    this.populate({path:"likedBy",select:"userName"}).populate({path:"likedPost",select:"content"});
    next();
});

const LikePost = mongoose.model("LikePost", likePostSchema);
module.exports = LikePost;