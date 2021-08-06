const express = require('express');
const User = require('../../schemas/UserModel')
const Post = require('../../schemas/PostModel')
const LikePost = require('../../schemas/LikePostModel')
const catchAsync = require("../../utils/catchAsync")
const AppError = require("../../utils/appError")
const ApiFeatures = require("../../utils/apiFeatures")
const router = express.Router();

router.get('/', async (req, res, next) => {


})

router.post('/', catchAsync(async (req, res, next) => {
    // TODO need check if user logged in. not allow create post with req.body
    const {likedBy, likedPost} = req.body;
    if (!likedBy || !likedPost) {
        return new AppError('Need Logged in and likes a post ', 400)
    }

   const data = await LikePost.create({likedBy, likedPost});

   return  res.status(200).json({
        status:"success",
        data
    })

}))

module.exports = router;


