let controller = require('./controller');
const User = require("../models/user");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


class userController extends controller {

    async getCurrentUserID(req, res) {
        try {
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
        } catch (err) {
            console.log(err);
        }

    }

    async logout(req, res) {
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

    async getUser(req, res) {
        try {
            let user = await User.findById(req.params.id);
            res.status(200).json({
                user: user
            })
        } catch (err) {
        }
    }

    async updateUser(req, res, next) {
        const { id, first_name, last_name, email } = req.body;
        await User.updateOne({ _id: id }, { $set: { first_name, last_name, email } })
        res.status(200).json({
            msg: "Information Updated"
        })
    }

    async updatePassword(req, res, next) {
        const { id, previousPassword, newPassword } = req.body;
        let user = await User.findById(id);
        const result = await bcrypt.compare(previousPassword, user.password);
        if (result) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.updateOne({ _id: id }, { $set: { password: hashedPassword } })
            res.status(200).json({
                updated: true,
                msg: "Password Changed"
            })
        } else {
            res.json({
                updated: false,
                msg: "Wrong Password"
            })
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