const express = require("express");
const router = express.Router();
let classController = require('../controllers/classController');

router.post("/", classController.createClass.bind(classController))
router.get("/:id", classController.getAllClasses.bind(classController))
router.post("/add_to_class", classController.joinClass.bind(classController))
router.get("/get_several_classes/:id", classController.getSeveralClasses.bind(classController))
module.exports = router