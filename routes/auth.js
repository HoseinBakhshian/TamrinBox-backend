const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const res = require("express/lib/response");

router.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                let id = user._id
                const token = jwt.sign({ id }, "jwtkey", { expiresIn: '1d' })
                res.json({ login: true, token, id });
            } else {
                res.json({ login: false });
            }
        } else {
            res.json({ login: false });
        }
    } catch (err) {
        console.log(err);
    }
})


router.post("/register", async (req, res) => {

    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            res.send("419");
        }
        if (!user) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            let newUser = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: hashedPassword
            });
            await newUser.save();
            res.send("420");
        }

    } catch (err) {
        res.send("418");
        console.log(err);
        next(err);
    }


})


const verifyjwt = (req, res, next) => {
    console.log(req.headers);
    const token = req.headers['access-token'];

    if (!token) {
        return res.json("need a token");
    } else {
        jwt.verify(token, "jwtkey", (err, decoded) => {
            if (err) {
                res.json("not authenticates")
            } else {
                req.id = decoded.id;
                next();
            }
        })
    }
}

router.get('/checkauth', (req, res) => {
    const token = req.headers['access-token'];

    if (!token) {
        return res.json("need a token");
    } else {
        jwt.verify(token, "jwtkey", (err, decoded) => {
            if (err) {
                res.json("not authenticates")
            } else {
                req.id = decoded.id;
                return res.json("authenticated")
            }
        })
    }

})

module.exports = router

