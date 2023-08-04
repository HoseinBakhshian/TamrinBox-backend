const express = require("express");
const router = express.Router();
let userController = require('../controllers/userController');


router.get("/getCurrentUserID", userController.getCurrentUserID.bind(userController))

router.get("/logout", userController.logout.bind(userController))

router.get("/getUser/:id", userController.getUser.bind(userController))



router.put("/updateUser", userController.updateUser.bind(userController))
router.put("/updatePassword", userController.updatePassword.bind(userController))

router.delete("/:id", userController.deleteUser.bind(userController))

module.exports = router

