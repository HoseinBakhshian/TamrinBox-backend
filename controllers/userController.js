let controller = require('./controller');
const User = require("../models/user");
const { validationResult } = require('express-validator');

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