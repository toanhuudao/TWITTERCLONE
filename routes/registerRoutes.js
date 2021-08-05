const express = require('express');

const User = require('../schemas/User')
const bcrypt = require('bcrypt');
const multer = require('multer')

const router = express.Router();

const upload = multer({dest: 'public/img/users'});

router.get('/', (req, res, next) => {
    res.status(200).render("register");
})

router.post('/', upload.single(), async (req, res, next) => {
    const {firstName, lastName, userName, email, password, passwordConf} = req.body;
    const payload = req.body
    if (firstName && lastName && userName && email && password) {
        const user = await User.findOne({
            $or: [
                {userName},
                {email}
            ]
        })
            .catch((e) => {
                payload.errorMessage = 'something went wrong.'
                console.log(e)
            })

        if (!user) {
            const data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data).then((user) => {
                req.session.user = user;
                return res.status(200).json({
                    data,
                    status: 'success'
                });
            })
                .catch((e) => {
                    payload.errorMessage = 'something went wrong.'
                    console.log(e)
                });
        } else {
            if (email === user.email) {
                payload.errorMessage = "Email already in use";
            } else {
                payload.errorMessage = "Username already in use";
            }
        }
        // return  res.status(200).render('register', payload)
    } else {
        payload.errorMessage = 'Make sure each field has a valid value.'
        return res.status(200).render('register', payload)
    }
})

module.exports = router;


