const express = require('express');
const User = require('../schemas/UserModel');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).render("login");
})

router.post('/', async (req, res, next) => {
    const {logUsername, logPassword} = req.body;
    try {
        if (!logUsername || !logPassword) {
            return res.status(200).json({
                errorMessage: "Need email and password to login."
            })
        }

        const user = await User.findOne({$or: [{email: req.body.logUsername}, {userName: req.body.logUsername}]});

        if (!user || !await user.correctPassword(logPassword, user.password)) {
            return res.status(200).json({
                errorMessage: "Incorrect username/email or password."
            })
        }

        req.session.user = user;
        return res.status(200).json({
            errorMessage:undefined,
            user
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;


