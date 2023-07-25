let controller = require('./controller');
const Class = require("../models/class");
const User = require("../models/user");
const multer = require('multer');

class classController extends controller {

    async createClass(req, res) {
        console.log(req.body.thumbnail);
        try {
            let new_Class = new Class({
                class_name: req.body.class_name,
                password: req.body.password,
                capacity: req.body.capacity,
                thumbnail: req.body.thumbnail,
                owner: req.body.owner,
            });
            await new_Class.save();
            res.status(200).json({
                mess: "کلاس اضافه شد"
            })
        } catch (err) {
            console.log(err);
        }
    }

    async joinClass(req, res) {
        try {
            let class_id = req.body.class_id
            let password = req.body.password
            let user_id = req.body.user_id

            let _class = await Class.findOne({ _id: class_id });

            if (_class) {
                if ((_class.password != "" && _class.password == password) || _class.password == "") {
                    await User.updateOne({ _id: user_id }, { $addToSet: { memeberships: class_id } })
                    await Class.updateOne({ _id: class_id }, { $addToSet: { memebers: user_id } });
                    res.json({
                        mess: "شما به کلاس اضافه شدید",
                        join: true
                    })
                } else if (_class.password != "" && _class.password != password) {
                    res.json({
                        mess: "رمز اشتباه است",
                        join: false
                    })
                }
            } else {
                res.json({
                    mess: "همچین کلاسی وجود ندارد",
                    join: false
                })
            }

            // if (_class) {
            //     if (_class.password == password) {
            //         await User.updateOne({ _id: user_id }, { $addToSet: { memeberships: class_id } })
            //         await Class.updateOne({ _id: class_id }, { $addToSet: { memebers: user_id } });
            //         res.json({
            //             mess: "شما به کلاس اضافه شدید",
            //             join: true
            //         })
            //     } else {
            //         res.json({
            //             mess: "رمز اشتباه است",
            //             join: false
            //         })
            //     }
            // } else {
            //     res.json({
            //         mess: "همچین کلاسی وجود ندارد",
            //         join: false
            //     })
            // }

        } catch (err) {
            console.log(err);
        }
    }

    //return those classes that you are teacher
    async getAllClasses(req, res) {
        try {
            let data = await Class.find({ owner: req.params.id });
            res.status(200).json({
                classes: data,
            })
        } catch (err) {
            next(err);
        }
    }

    //return those classes that you are student
    async getSeveralClasses(req, res) {
        try {
            let user = await User.findOne({ _id: req.params.id });

            let classes = await Class.find({ _id: { $in: user.memeberships } });

            res.status(200).json({
                classes: classes,
            })
        } catch (err) {
            console.log(err);
        }
    }


}

module.exports = new classController;