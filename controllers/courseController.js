const multer = require('multer');
let controller = require('./controller');
const Course = require('../models/course');
const User = require("../models/user");
let fs = require('fs');
const { log } = require('console');
const zip = require('express-zip')
// const zip = require('express-easy-zip');

class courseController extends controller {

    async createCourse(req, res) {
        try {
            // console.log(req.body);
            // console.log(req.body);

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
            
            let courses = await Course.find({ class_id: req.params.class_ID });
            let data = []
            for (let i = 0; i < courses.length; i++) {
                let x = {
                    _id: courses[i]._id,
                    course_name: courses[i].course_name,
                    file: courses[i].file,
                    description: courses[i].description,
                    deadline: courses[i].deadline,
                }
                data.push(x)
            }
            res.status(200).json({
                courses: data
            })

        } catch (err) {
            console.log(err);
        }
    }

    async downloadFile(req, res) {
        try {
            res.download(config.rootPath + `/uploads/files/${req.params.fileURL}`);
        } catch (err) {
            console.log(err);
        }
    }

    async downloadAll(req, res) {
        try {
            console.log("downloadAll");
            let course = await Course.findById(req.params.courseID);
            let files = [];
            for (let i = 0; i < course.inbox.length; i++) {
                let y = config.rootPath + `/uploads/inbox/${course.inbox[i].file_id}`
                let x = { path: y, name: course.inbox[i].file_id }
                files.push(x)
            }
            res.zip(files);

            // res.zip([
            //     { path: 't1.png', name: 't1.png' },
            //     { path: 't2.png', name: 't2.png' },
            // ]);

            // res.zip([
            //     { path: 't1.png', name: 't1.png' },
            // ]);

            // let files = [
            //     { path: 't1.png', name: 't1.png' },
            //     { path: 't2.png', name: 't2.png' }
            // ]
            //  let filename = "newfile";
            // res.zip = function (files, filename, cb) {
            //     cb(err, bytesZipped)
            // }
            // res.zip;

            // res.zip({
            //     files: [

            //     { path: 't1.png', name: 't1.png' },
            //     { path: 't2.png', name: 't2.png' }
            //     ],
            //     filename: 'zip-file-name.zip'
            // });


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
            // console.log(req.body);
            let x = {
                user_id: req.body.user_id,
                file_id: req.file.filename
            }
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

            let all = {
                number: 0,
                fullName: "all",
                email: "all",
                file_id: ""
            }

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