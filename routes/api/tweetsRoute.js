const express = require('express');
const chalk = require('chalk')
const User = require('../../schemas/UserModel')
const Post = require('../../schemas/PostModel')
const Retweet = require('../../schemas/RetweetModel')
const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/appError")
const ApiFeatures = require("../../utils/apiFeatures")
const router = express.Router({mergeParams: true});

router.get('/', async (req, res, next) => {


})

router.get('/:id', async (req, res, next) => {
    // const likePost = await LikePost.findById({_id: req.params.id});
    // return res.status(200).json({
    //     status: "success",
    //     data: likePost
    // })
})

router.put('/', catchAsync(async (req, res, next) => {
    if (!req.session || !req.session.user) {
        return next(new AppError('Undefined logged in/ post', 400))
    }

    const retweetFrom = req.params.postId;
    const currentUserId = req.session.user._id;
    // // TODO change id of user to test.
    // const retweetBy = "610c15a951d07d4fec37a168"

    const currentPost = JSON.parse(JSON.stringify(await Post.findOne({_id: retweetFrom}).populate({path: "retweetData"})));
    if (!retweetFrom) {
        return next(new AppError('no post selected', 400))
    }
    // check if post already retweet
    if (currentPost.retweetData.length === 0 && !await Retweet.findOne({retweetFrom, retweetBy: currentUserId})) {
        const retweetByPost = await Post.create({postedBy: currentUserId})
        await Retweet.create({retweetBy: currentUserId, retweetFrom, retweetTo: retweetByPost._id});
    }

    if (currentPost.retweetData.length !== 0 && currentPost.retweetData[0].retweetBy !== currentUserId) {
        //create new post and retweet of retweetData
        const retweetByPost = await Post.create({postedBy: currentUserId})
        await Retweet.create({
            retweetBy: currentUserId,
            retweetFrom: currentPost.retweetData[0].retweetFrom,
            retweetTo: retweetByPost._id
        });
    }

    return res.status(200).json({
        status: "success",
        data,
        // totalRetweetOfPost,
    })

}))

module.exports = router;


