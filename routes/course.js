const express = require("express");
const courseController = require("../controllers/courseController");
const multer = require("multer");
const config = require("../config");
const router = express.Router();


const storage1 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, config.rootPath + "/uploads/files")
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
})

const storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, config.rootPath + "/uploads/inbox")
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    },
    onError : function(err, next) {
         console.log('error', "err");
        // next(err);
      }
})

const uploads1 = multer({ storage: storage1 })
const uploads2 = multer({ storage: storage2 })


router.get("/getMyClasses/:classID", courseController.getMyClasses.bind(courseController))
router.get("/getOthersclasses/:classID/:userID", courseController.getOthersclasses.bind(courseController))
router.get("/downloadFile/:fileURL", courseController.downloadFile.bind(courseController))
router.get("/downloadInboxFile/:fileURL", courseController.downloadInboxFile.bind(courseController))
router.get("/downloadAll/:courseID", courseController.downloadAll.bind(courseController))
router.get("/getInbox/:courseID", courseController.getInbox.bind(courseController))

router.post("/createCourse", uploads1.single('file'), courseController.createCourse.bind(courseController))
router.post("/uploadFile", uploads2.single('file'), courseController.uploadFile.bind(courseController))

router.delete("/removeCourse/:courseID", courseController.removeCourse.bind(courseController))

module.exports = router