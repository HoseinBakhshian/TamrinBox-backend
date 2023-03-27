const express = require("express");
const cors = require("cors")
const router = require("./routes/user")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');

require('dotenv').config()
global.config = require("./config")
mongoose.connect('mongodb://127.0.0.1:27017/TamrinBox');
app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.get("/", (req, res) => {
//     console.log(req.query);
//     res.send("hello son");
// })
// app.get("/:id/:test", (req, res) => {
//     res.send(req.params);
// })

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
// app.use(flash());
app.use('/', router);




app.listen(config.port, () => {
    console.log("server is running on port 8000");
})