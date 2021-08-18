const express = require('express');
const User = require('../../schemas/UserModel')
const Post = require('../../schemas/PostModel')
const likeRouter = require('./likesRoute')
const tweetsRouter = require('./tweetsRoute')
const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/appError")
const ApiFeatures = require("../../utils/apiFeatures")
const router = express.Router();
const _ = require("lodash")

router.get('/', async (req, res, next) => {

    if (!req.session.user) {
        return next(new AppError("Please login !", 400));
    }

    const features = new ApiFeatures(Post.find({isActive: true}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const posts = await features.query.populate({path: "postedBy"}).populate({path: "likedByUsers"}).populate({
        path: "retweetTo",
        select: "-retweetTo"
    }).populate({
        path: "replyTo",
        populate: {path: 'postedBy', select: "userName"}
    })
    // const posts = await Post.find().populate({path: "postedBy"});

    const postParse = JSON.parse(JSON.stringify(posts));

    postParse.forEach(post => {
        const likedByUsers = _.map(post.likedByUsers, "likedBy");
        post.isLikeByCurrentUser = likedByUsers.some(likedByUser => likedByUser._id === req.session.user._id);
    })

    return res.status(200).json({
        status: "success",
        posts: postParse
    })
})

router.get('/:id', catchAsync(async (req, res, next) => {
    const data = await Post.findById({_id: req.params.id}).populate({
        path: "likedByUsers",
        select: "likedBy -likedPost"
    }).populate({
        path: "retweetBy",
    }).populate({path: "postedBy"}).populate({path: "replyTo", populate: {path: 'postedBy', select: "userName"}});

    const replies = await Post.find({replyTo: req.params.id}).populate({path: "postedBy"}).populate({path: "replyTo", populate: {path: 'postedBy', select: "userName"}}).populate({
        path: "likedByUsers",
        select: "likedBy -likedPost"
    });

    return res.status(200).json({
        status: "success",
        data,
        replies
    })
}))

router.post('/', catchAsync(async (req, res, next) => {
    if (!req.body.content) {
        return next(new AppError("Post can not be empty!", 400));
    }

    if (!req.session.user) {
        return next(new AppError("Please login to create post!", 400));
    }

    const postData = {
        content: req.body.content,
        postedBy: req.session.user._id,
        replyTo: req.body.replyTo
    }

    let post = await Post.create(postData);

    // post = await User.populate(post, {path: "postedBy", select: "userName"});
    post = await Post.findOne({_id: post._id}).populate({
        path: "postedBy",
        select: "userName profilePic firstName lastName"
    }).populate({
        path: "likedByUsers",
        select: "likedBy -likedPost"
    })

    return res.status(200).json({
        status: "success",
        post
    })
}))

router.delete("/:id", catchAsync(async (req, res, next) => {
   await Post.findByIdAndDelete(req.params.id);
    return res.status(202).json({
        status: "success"
    })
}))

router.use('/:postId/likes', likeRouter);
router.use('/:postId/retweets', tweetsRouter);

module.exports = router;


