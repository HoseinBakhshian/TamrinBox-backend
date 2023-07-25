require('app-module-path').addPath(__dirname);
const express = require("express");
const cors = require("cors")
const index = require("./index")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const jwt = require('jsonwebtoken');
const multer = require('multer');


app.use(express.static(__dirname + "/uploads"));
require('dotenv').config()
global.config = require("./config")
mongoose.connect('mongodb://127.0.0.1:27017/TamrinBox');
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}))


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, expires: new Date(Date.now() + 100 * 3600) },
    store: mongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/auth' })
}))
app.use(cookieParser("secretcode"));


app.use('/', index);




app.listen(config.port, () => {
    console.log("server is running on port 8000");
})