let controller = require('./controller');
const Class = require("../models/class");
const User = require("../models/user");
const Course = require('../models/course');
class classController extends controller {

    async createClass(req, res) {

        try {
            let new_Class = new Class({
                class_name: req.body.class_name,
                password: req.body.password,
                capacity: req.body.capacity || "200",
                thumbnail: typeof (req.file) != 'undefined' ? req.file.filename : "default_class_Thumbnail.jpeg",
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

    async removeClass(req, res) {
        try {
            let x = await Class.findOne({ _id: req.params.classID })
            await Class.deleteOne({ _id: req.params.classID })
            await User.updateMany({ _id: { $in: x.memebers } }, { $pull: { memeberships: req.params.classID } })
            await Course.deleteMany({ class_id: req.params.classID })


            res.status(200).json({
                msg: "کلاس حذف شد",
                deleted: true
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
            let haveCapacity = parseInt(_class.capacity) > _class.memebers.length;
            if (_class && haveCapacity) {
                if (_class.owner == user_id) {
                    res.json({
                        mess: "امکان عضویت در کلاس خود را ندارید",
                        join: false
                    })
                }
                else if ((_class.password == password) || _class.password == "") {
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
            } else if (_class && !haveCapacity) {
                res.json({
                    mess: "ظرفیت کلاس تکمیل است",
                    join: false
                })
            }
            else {
                res.json({
                    mess: "همچین کلاسی وجود ندارد",
                    join: false
                })
            }


        } catch (err) {
            res.json({
                mess: "همچین کلاسی وجود ندارد",
                join: false
            })
            console.log(err);
        }
    }

    async leaveClass(req, res) {
        try {
            let x = await Class.findOne({ _id: req.body.classID })
            await User.updateOne({ _id: req.body.userID }, { $pull: { memeberships: req.body.classID } })

            await Class.updateOne({ _id: req.body.classID }, { $pull: { memebers: req.body.userID } })

            let y = await Course.find({ class_id: req.body.classID })

            await Course.updateMany({ class_id: req.body.classID }, { $pull: { inbox: { user_id: req.body.userID } } })



            res.status(200).json({
                msg: "از کلاس خارج شدید",
            })

        } catch (err) {
            console.log(err);
        }
    }


    async updateClass(req, res) {
        try {
            let class_name = req.body.class_name;
            let password = req.body.password;
            let capacity = req.body.capacity;

            await Class.updateOne({ _id: req.body.class_id }, { $set: { class_name, password, capacity } })
            res.json({
                mess: "تغییرات اعمال شد",
            })

        } catch (err) {
            console.log(err);
        }
    }


    async getClassInfo(req, res) {
        try {
            let _class = await Class.findOne({ _id: req.params.classID });
            let x = {
                class_name: _class.class_name,
                password: _class.password,
                capacity: _class.capacity,
                members: _class.memebers.length
            }
            res.json({
                mess: "اطلاعات کلاس ارسال شد",
                info: x
            })

        } catch (err) {
            console.log(err);
        }
    }

    //return those classes that you are teacher
    async getMyClasses(req, res) {
        try {
            let classes = await Class.find({ owner: req.params.userID });

            let data = []
            for (let item = 0; item < classes.length; item++) {
                let owner = await User.findOne({ _id: classes[item].owner });

                let x = {
                    _id: classes[item]._id,
                    class_name: classes[item].class_name,
                    thumbnail: classes[item].thumbnail,
                    owner: owner.first_name + " " + owner.last_name,
                    memebers: classes[item].memebers.length,
                }
                data.push(x)
            }
            res.status(200).json({
                classes: data,
            })
        } catch (err) {
            console.log(err);
        }
    }

    //return those classes that you are student
    async getOthersClasses(req, res) {
        try {
            let user = await User.findOne({ _id: req.params.userID });
            let classes = await Class.find({ _id: { $in: user.memeberships } });

            let data = []
            for (let item = 0; item < classes.length; item++) {
                let owner = await User.findOne({ _id: classes[item].owner });
                let x = {
                    _id: classes[item]._id,
                    class_name: classes[item].class_name,
                    thumbnail: classes[item].thumbnail,
                    owner: owner.first_name + " " + owner.last_name,
                    memebers: classes[item].memebers.length,
                }
                data.push(x)
            }

            res.status(200).json({
                classes: data,
            })
        } catch (err) {
            console.log(err);
        }
    }


}

module.exports = new classController;