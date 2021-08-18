const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {type: String, trim: true, default: ""},
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    pinned: {type: Boolean, default: false},
    isLikeByCurrentUser: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
    replyTo: {type: mongoose.Schema.Types.ObjectId, ref: "Post"}
}, {
    timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}
})

const Post = mongoose.model("Post", postSchema);

postSchema.virtual("likedByUsers", {
    ref: "LikePost",
    foreignField: "likedPost",
    localField: "_id",
    match: {
        isLiked: true
    }
});

postSchema.virtual("retweetData", {
    ref: "Retweet",
    foreignField: "retweetTo",
    localField: "_id",
    match: {
        isActive: true
    }
})

// postSchema.pre(/^find/, function(next) {
//     this.populate({path:"likedByUsers"});
//     next();
// });

module.exports = Post;

