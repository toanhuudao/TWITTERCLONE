const express = require('express');
const User = require('../../schemas/UserModel')
const Post = require('../../schemas/PostModel')
const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/appError")
const ApiFeatures = require("../../utils/apiFeatures")
const router = express.Router();

router.get('/', async (req, res, next) => {

    // if (!req.session.user) {
    //     return next(new AppError("Please login !", 400));
    // } // TODO pass it to test post man, need open again

    const features = new ApiFeatures(Post.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const posts = await features.query.populate({path: "postedBy"});

    // const posts = await Post.find().populate({path: "postedBy"});

    return res.status(200).json({
        status: "success",
        posts
    })
})

router.post('/', catchAsync(async (req, res, next) => {
    if (!req.body.content) {
        return next(new AppError("Post can not be empty!", 400));
    }

    // if (!req.session.user) {
    //     return next(new AppError("Please login to create post!", 400));
    // } // TODO pass it to test post man, need open again

    const postData = {
        content: req.body.content,
        postedBy: req.session.user._id
    }

    let post = await Post.create(postData);

    // post = await User.populate(post, {path: "postedBy", select: "userName"});
    post = await Post.findOne({_id: post._id}).populate({
        path: "postedBy",
        select: "userName profilePic firstName lastName"
    })

    return res.status(200).json({
        status: "success",
        post
    })
}))

module.exports = router;


