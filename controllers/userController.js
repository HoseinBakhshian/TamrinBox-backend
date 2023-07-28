let controller = require('./controller');
const User = require("../models/user");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


class userController extends controller {

    async getAllUsers(req, res, next) {
        try {
            let data = await User.find({});
            res.status(200).json({
                users: data,
            })
        } catch (err) {
            next(err);
        }

    }

    async getCurrentUserID(req, res, next) {

        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(req.cookies.jwt, "jwtkey", (err, decoded) => {
                if (err) {
                    res.json({
                        msg: "not authenticates",
                        authenticated: false
                    })
                } else {
                    res.json({
                        msg: "authenticates",
                        authenticated: true,
                        id: decoded.id
                    })
                }
            })
        }

        if (typeof (token) == 'undefined') {
            res.json({
                msg: "not authenticates",
                authenticated: false
            })
        }
    }

    async logout(req, res, next) {
        try {
            res.cookie('jwt', '', { maxAge: 1 })
            res.json({
                msg: "از حساب خارج شدید",
                logout: true
            });
        } catch (err) {
            next(err)
        }
    }

    async getOneUser(req, res, next) {
        try {
            let user = await User.findById(req.params.id);
            res.status(200).json({
                user: user
            })
        } catch (err) {
            next(err)
        }
    }

    async createUser(req, res, next) {
        try {
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
        }
        catch (err) {
            next(err)
        }


    }

    async updateUser(req, res, next) {
        try {
            await User.updateOne({ _id: req.params.id }, { $set: req.body });
            res.json({
                data: "کاربر ویرایش شد"
            })
        } catch (err) {
            next(err)
        }

    }

    async deleteUser(req, res, next) {
        try {
            await User.deleteOne({ _id: req.params.id });
            res.json({
                data: "کاربر حذف شد"
            })
        } catch (err) {
            next(err);
        }


    }


}

module.exports = new userController;