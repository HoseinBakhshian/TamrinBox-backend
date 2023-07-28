const express = require("express");
const router = express.Router();
let userController = require('../controllers/userController');
let userValidator = require('../validators/userValidator');

router.get("/", userController.getAllUsers.bind(userController))

router.get("/getCurrentUserID/55", userController.getCurrentUserID.bind(userController))

router.get("/logout/55", userController.logout.bind(userController))

router.get("/:id", userController.getOneUser.bind(userController))




router.post("/", userValidator.handle(), userController.createUser.bind(userController))

router.put("/:id", userController.updateUser.bind(userController))

router.delete("/:id", userController.deleteUser.bind(userController))

module.exports = router

