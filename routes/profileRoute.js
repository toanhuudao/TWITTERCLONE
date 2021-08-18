const express = require('express');
const User = require('../schemas/UserModel')
const Post = require('../schemas/PostModel')
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const ApiFeatures = require("../utils/apiFeatures")
const router = express.Router();
const _ = require("lodash")

router.get('/:username', catchAsync(async (req, res, next) => {

    const user = await User.findOne({userName: req.params.username});

    const payload = {
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    if (!user) {
        payload.pageTitle = "User not found."
    } else {
        payload.pageTitle = user.userName;
        payload.profileUser = user
    }

    res.status(200).render("profilePage", payload);
}))

module.exports = router;


