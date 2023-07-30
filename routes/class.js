const express = require("express");
const router = express.Router();
let classController = require('../controllers/classController');
const multer = require("multer");




const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, config.rootPath + "/uploads/thumbnails")
    },
     filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
})

const uploads = multer({ storage: storage })

router.post("/createClass", uploads.single('thumbnail'), classController.createClass.bind(classController))
router.post("/joinClass", classController.joinClass.bind(classController))


router.get("/getMyClasses/:userID", classController.getMyClasses.bind(classController))
router.get("/getOthersClasses/:userID", classController.getOthersClasses.bind(classController))


router.delete("/removeClass/:classID", classController.removeClass.bind(classController))
router.delete("/leaveClass", classController.leaveClass.bind(classController))
module.exports = router