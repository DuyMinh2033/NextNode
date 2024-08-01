const express = require("express");
const router = express.Router();
const UserController = require("../Controller/UserController");
const verifyToken = require("../middleware/verifyToken");
router.post("/login", UserController.LoginUser);
router.post("/register", UserController.Register);
router.post("/logout", UserController.Log0utUser);

router.get("/get-users", verifyToken, UserController.getUsers);
router.get("/get-user/:id", verifyToken, UserController.getUser);
router.put("/update-user/:id", verifyToken, UserController.UpdateUser);
router.delete("/delete-user/:id", verifyToken, UserController.deleteUser);

module.exports = router;
