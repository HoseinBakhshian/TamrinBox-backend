const express = require("express");
const courseController = require("../controllers/courseController");
const multer = require("multer");
const config = require("../config");
const router = express.Router();




const storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, config.rootPath + "/uploads/inbox")
    },
     filename: function (req, file, callback) {
         callback(null, Date.now() + file.originalname)
    }
})
const storage1 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, config.rootPath + "/uploads/files")
    },
     filename: function (req, file, callback) {
         callback(null, Date.now() + file.originalname)
    }
})


const uploads2 = multer({ storage: storage2 })
const uploads1 = multer({ storage: storage1 })


router.get("/:class_ID", courseController.getAllCourse.bind(courseController))
router.get("/downloadFile/:fileURL", courseController.downloadFile.bind(courseController))
router.get("/downloadAll/:courseID", courseController.downloadAll.bind(courseController))
router.get("/getInbox/:courseID", courseController.getInbox.bind(courseController))

router.post("/", uploads1.single('file'), courseController.createCourse.bind(courseController))

router.post("/uploadFile", uploads2.single('file2'), courseController.uploadFile.bind(courseController))

router.delete("/:courseID", courseController.removeCourse.bind(courseController))

module.exports = router