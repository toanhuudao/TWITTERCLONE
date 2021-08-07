const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {type: String, required: true, trim: true},
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    pinned: {type: Boolean, default: false},

}, {
    timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}
})

const Post = mongoose.model("Post", postSchema);

postSchema.virtual("likedByUsers", {
    ref: "LikePost",
    foreignField: "likedPost",
    localField: "_id",
});

// postSchema.pre(/^find/, function(next) {
//     this.populate({path:"likedByUsers"});
//     next();
// });

module.exports = Post;

