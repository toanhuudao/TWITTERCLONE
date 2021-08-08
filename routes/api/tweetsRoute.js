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

    const retweetFrom = req.params.postId;
    // const retweetBy = req.session.user._id;
    // TODO change id of user to test.
    const retweetBy = "610c15a951d07d4fec37a168"

    // if (!retweetBy || !retweetPost) {
    //     return next(new AppError('Undefined logged in/ post', 400))
    // }


    let data = await Retweet.findOne({retweetFrom, retweetBy});

    if (!data) {
        const post = await Post.create({postedBy: retweetBy})
        data = await Retweet.create({retweetBy, retweetFrom,retweetTo:post._id});
    } else {
        data.isActive = !data.isActive;
        data = await data.save();
    }

    const totalRetweetOfPost = await Retweet.find({retweetFrom, isActive: true}).count();

    return res.status(200).json({
        status: "success",
        data,
        totalRetweetOfPost,
        isRetweetByCurrentUser
    })

}))

module.exports = router;


