const express = require('express');
const app = express();
const port = 3004;
const middleware = require('./middleware');
const path = require('path');
const mongoose = require('./database')
const session = require('express-session')
const cors = require("cors");

const server = app.listen(port, () => {
    console.log('server listening on port: ' + port)
})
app.use(cors({ credentials: true, origin: "http://127.1.1.0:3004" }));
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({
    extended: true,
    limit: "10kb"
}));

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

//session
app.use(session({
    secret: "chicken bbq",
    resave: true,
    saveUninitialized: false
}))

//Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes')
app.use("/login", loginRoute);
app.use("/register", registerRoute);


app.get('/', middleware.requireLogin, (req, res, next) => {
    const payload = {
        pageTitle: "home",
        userLoggedIn: req.session.user
    }

    res.status(200).render("home", payload);
});

