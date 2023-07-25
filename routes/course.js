const express = require("express");
const courseController = require("../controllers/courseController");
const multer = require("multer");
const config = require("../config");
const router = express.Router();


let date = new Date();
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, config.rootPath + "/uploads")
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
})

const uploads = multer({ storage: storage })

router.get("/:class_ID", courseController.getAllCourse.bind(courseController))
router.get("/downloadFile/:fileURL", courseController.downloadFile.bind(courseController))
router.get("/getInbox/:courseID", courseController.getInbox.bind(courseController))

router.post("/", uploads.single('file'), courseController.createCourse.bind(courseController))
router.post("/uploadFile", uploads.single('file'), courseController.uploadFile.bind(courseController))

router.delete("/:courseID", courseController.removeCourse.bind(courseController))

module.exports = router