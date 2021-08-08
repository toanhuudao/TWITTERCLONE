const express = require('express');
const User = require('../../schemas/UserModel')
const Post = require('../../schemas/PostModel')
const LikePost = require('../../schemas/LikePostModel')
const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/appError")
const ApiFeatures = require("../../utils/apiFeatures")
const router = express.Router({mergeParams: true});

router.get('/', async (req, res, next) => {


})

router.get('/:id', async (req, res, next) => {
    const likePost = await LikePost.findById({_id: req.params.id});
    return res.status(200).json({
        status: "success",
        data: likePost
    })
})

router.put('/', catchAsync(async (req, res, next) => {

    const likedPost = req.params.postId;
    const likedBy = req.session.user._id;

    if (!likedBy || !likedPost) {
        return next(new AppError('Undefined logged in/ post', 400))
    }

    let data = await LikePost.findOne({likedBy, likedPost});

    if (!data) {
        data = await LikePost.create({likedBy, likedPost});
    } else {
        data.isLiked = !data.isLiked;
        data = await data.save();
    }

    const totalLikeOfPost = await LikePost.find({likedPost, isLiked: true}).count();
    const isLikeByCurrentUser = !!(await LikePost.find({likedPost, likedBy, isLiked: true}).count());

    return res.status(200).json({
        status: "success",
        data,
        totalLikeOfPost,
        isLikeByCurrentUser
    })

}))

module.exports = router;


