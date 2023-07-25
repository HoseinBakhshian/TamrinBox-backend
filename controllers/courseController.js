const multer = require('multer');
let controller = require('./controller');
const Course = require('../models/course');
const User = require("../models/user");
let fs = require('fs');


class courseController extends controller {

    async createCourse(req, res) {
        try {

            let course = new Course({
                class_id: req.body.class_id,
                course_name: req.body.title,
                file: req.file.filename,
                description: req.body.description,
                deadline: req.body.deadline,
            })
            await course.save();
            res.status(200).json({
                mess: "فایل اضافه شد"
            })

        } catch (err) {
            console.log(err);
        }
    }

    async getAllCourse(req, res) {
        try {
            // console.log("get all course");
            let courses = await Course.find({ class_id: req.params.class_ID });
            res.status(200).json({
                courses: courses
            })


        } catch (err) {
            console.log(err);
        }
    }

    async downloadFile(req, res) {
        try {
            res.download(config.rootPath + `/uploads/${req.params.fileURL}`);
        } catch (err) {
            console.log(err);
        }
    }

    async removeCourse(req, res) {
        try {
            let course = await Course.findOne({ _id: req.params.courseID })
            let x = await Course.deleteOne({ _id: req.params.courseID })

            if (x.acknowledged == true) {
                res.json({
                    mess: "deleted",
                    deleted: true
                })
            } else {
                res.json({
                    mess: "some problem occured",
                    deleted: false
                })
            }

            fs.unlink(config.rootPath + `/uploads/${course.file}`, async (err) => {
                if (err) {
                    throw err;
                }
            });


        } catch (err) {
            console.log(err);
        }
    }

    async uploadFile(req, res) {
        try {
            console.log("uploadfile");
            let x = {
                user_id: req.body.user_id,
                file_id: req.file.filename
            }

            // await Course.deleteOne({ inbox: { $elemMatch: { user_id: req.body.user_id } } })
            // await Course.updateOne({ _id: req.body.courseID }, { $push: { inbox: x } });

            let course = await Course.findOne({ _id: req.body.courseID });
            let inbox = course.inbox;
            let unique_inbox = inbox.filter((item) => (item.user_id != req.body.user_id));
            unique_inbox.push(x);

            await Course.updateOne({ _id: req.body.courseID }, { $set: { inbox: unique_inbox } });

            res.status(200).json({
                mess: "فایل اضافه شد"
            })

        } catch (err) {
            console.log(err);
        }
    }

    async getInbox(req, res) {
        try {
            let course = await Course.findOne({ _id: req.params.courseID });
            let members = course.inbox;

            const data = [];

            for (let index = 0; index < members.length; index++) {
                let user = await User.findById(members[index].user_id);
                let info = {
                    number: index + 1,
                    fullName: user.first_name + " " + user.last_name,
                    email: user.email,
                    file_id: members[index].file_id
                }
                data.push(info);
            }

            res.status(200).json({
                mess: "sended",
                files: data
            })

        } catch (err) {
            console.log(err);
        }
    }

}



module.exports = new courseController;