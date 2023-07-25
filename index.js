const express = require("express");
const router = express.Router();



router.use("/users", require("./routes/user"));
router.use("/auth", require("./routes/auth"));
router.use("/classes", require("./routes/class"));
router.use("/courses", require("./routes/course"));





module.exports = router;




