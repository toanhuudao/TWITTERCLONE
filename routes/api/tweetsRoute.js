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
    const currentPost = JSON.parse(JSON.stringify(await Post.findOne({_id: retweetFrom}).populate({path:"retweetData"})));
    console.log(currentPost)
    // check if post already retweet
    if (!currentPost.retweetData && !await Retweet.findOne({retweetFrom, retweetBy})) {
        console.log("con1")
        const retweetByPost = await Post.create({postedBy: retweetBy})
        await Retweet.create({retweetBy, retweetFrom, retweetTo: retweetByPost._id});
        console.log(retweetByPost)
    }

    if (currentPost.retweetData !== undefined && !await Retweet.findOne({retweetBy, retweetFrom: currentPost.retweetData.retweetFrom})){
        console.log("con2")
        //create new post and retweet of retweetData
        const retweetByPost = await Post.create({postedBy: retweetBy})
        await Retweet.create({retweetBy, retweetFrom: retweetFromPost._id, retweetTo: retweetByPost._id});
        console.log(retweetByPost);
    }

    const totalRetweetOfPost = await Retweet.find({retweetFrom, isActive: true}).count();

    return res.status(200).json({
        status: "success",
        data,
        totalRetweetOfPost,
    })

}))

module.exports = router;


