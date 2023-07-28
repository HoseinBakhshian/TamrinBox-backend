require('app-module-path').addPath(__dirname);
const express = require("express");
const cors = require("cors")
const index = require("./index")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');

require('dotenv').config()
global.config = require("./config")

mongoose.connect('mongodb://127.0.0.1:27017/TamrinBox');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    // methods: "GET,POST,PUT,DELETE",
    credentials: true
}))





app.use('/', index);




app.listen(config.port, () => {
    console.log("server is running on port 8000");
})