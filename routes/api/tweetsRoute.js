const express = require('express');
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
    const retweetBy = req.session.user._id;
    // // TODO change id of user to test.
    // const retweetBy = "610c15a951d07d4fec37a168"


    if (!retweetFrom) {
        return next(new AppError('no post selected', 400))
    }

    const currentPost = await Post.findOne({_id: retweetFrom});
    // check if post already retweet
    if (currentPost.retweetData.length === 0) {
        let retweetDataOfCurrentPost = await Retweet.findOne({retweetFrom, retweetBy});
        if (!retweetDataOfCurrentPost) {
            const retweetByPost = await Post.create({postedBy: retweetBy})
            await Retweet.create({retweetBy, retweetFrom, retweetTo: retweetByPost._id});
        }
    } else {
        // retweet data of current post
        let retweetOfCurrentPost = await Retweet.findOne({
            retweetFrom: currentPost.retweetData.retweetFrom,
            retweetBy: currentPost.retweetData.retweetBy
        });

        //post to current user retweet
        const retweetFromPost = await Post.findOne({_id: retweetOfCurrentPost.retweetTo});

        //check if current user already retweet post of retweetData
        if (await Retweet.findOne({retweetBy, retweetFrom: retweetFromPost._id})) {
            //create new post and retweet of retweetData
            const retweetByPost = await Post.create({postedBy: retweetBy})
            await Retweet.create({retweetBy, retweetFrom: retweetFromPost._id, retweetTo: retweetByPost._id});
        }
    }

    const totalRetweetOfPost = await Retweet.find({retweetFrom, isActive: true}).count();

    return res.status(200).json({
        status: "success",
        data,
        totalRetweetOfPost,
    })

}))

module.exports = router;


