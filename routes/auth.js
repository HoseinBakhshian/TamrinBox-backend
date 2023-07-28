const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const bcrypt = require('bcrypt');

router.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                let id = user._id
                let maxage = 3 * 24 * 60 * 60;
                const token = jwt.sign({ id }, "jwtkey", { expiresIn: maxage })
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxage * 1000 })
                res.json({ login: true});
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






module.exports = router

