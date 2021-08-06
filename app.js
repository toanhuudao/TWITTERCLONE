const express = require('express');
const app = express();
require('dotenv').config({ path: './config.env' })
const port = 3004;
const middleware = require('./middleware');
const path = require('path');
const mongoose = require('./database')
const session = require('express-session')
const cors = require("cors");
const globalErrorHandler =require("./controllers/errorController")

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
const logoutRoute = require('./routes/logoutRoutes')
//API routes
const postsApiRoute = require('./routes/api/postsRoute')
const likesApiRoute = require('./routes/api/likesRoute')

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);

app.use("/api/posts", postsApiRoute);
app.use("/api/likes", likesApiRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {
    const payload = {
        pageTitle: "home",
        userLoggedIn: req.session.user
    }
    res.status(200).render("home", payload);
});

app.use(globalErrorHandler);

