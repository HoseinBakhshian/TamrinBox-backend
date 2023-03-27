const express = require("express");
const User = require("../models/user");
const Class = require("../models/class");
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.get("/users", async (req, res) => {
    let data = await User.find({});
    res.status(200).json({
        users: data
    })
})

router.get("/users/:id", (req, res) => {
    let user = users.find(item => (item.id == req.params.id))
    res.status(200).json({
        data: user
    })

})

router.post("/users", body('email', 'ایمیل نامعتبر است').isEmail(), body('password', "طول پسورد کوتاه است").isLength({ min: 5 }), async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    });
    await newUser.save();

    res.status(200).json({
        data: "کاربر اضافه شد"
    })
})

router.put("/users/:id", (req, res) => {
    users = users.map((user) => {
        if (user.id == req.params.id) {
            return req.body;
        } else {
            return user
        }
    })


    res.json({
        data: "کاربر ویرایش شد"
    })
})

router.delete("/users/:id", (req, res) => {
    users = users.filter((user) => (req.params.id != user.id));
    res.json({
        data: "کاربر حذف شد"
    })
})


router.post("/classes", async (req, res) => {

    let newUser = new Class({
        first_name: req.body.first_name,
        email: req.body.email,
        password: req.body.password
    });
    await newUser.save();

    res.status(200).json({
        data: "کلاس اضافه شد"
    })
})

module.exports = router

