const express = require('express');
const User = require('../schemas/UserModel')
const Post = require('../schemas/PostModel')
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const ApiFeatures = require("../utils/apiFeatures")
const router = express.Router();
const _ = require("lodash")

router.get('/:id', catchAsync(async (req, res, next) => {

    const payload = {
        pageTitle: "View Post",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }
    res.status(200).render("postPage", payload);
}))

module.exports = router;


