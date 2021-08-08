const mongoose = require('mongoose');

const retweetSchema = new mongoose.Schema({
    retweetBy: {type: mongoose.Schema.ObjectId, ref: "User"},
    retweetFrom: {type: mongoose.Schema.ObjectId, ref: "Post"},
    retweetTo: {type: mongoose.Schema.ObjectId, ref: "Post"},
    isActive: {type: Boolean, default: true}
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}})

// retweetSchema.pre(/^find/, function (next) {
//     this.populate({path: "retweetBy", select: "userName"}).populate({path: "retweetFrom", select: "content"});
//     next();
// });

const Retweet = mongoose.model("Tweet", retweetSchema);
module.exports = Retweet;