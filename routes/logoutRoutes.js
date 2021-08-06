const express = require('express');
const User = require('../schemas/UserModel')

const router = express.Router();

router.get("/", (req, res, next) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect("/login")
        })
    }
})

module.exports = router;