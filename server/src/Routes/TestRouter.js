const express = require("express");
const router = express.Router();
const TestController = require("../Controller/TestController");
const verifyToken = require("../middleware/verifyToken");

router.get("/should-be-logged-in", verifyToken, TestController.shouldBeLogIn);
router.get("/should-be-logged-admin", TestController.shouldBeAdmin);

module.exports = router;
