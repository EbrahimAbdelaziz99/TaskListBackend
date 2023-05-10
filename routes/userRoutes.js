const express = require("express");
const router = express.Router();

const userController = require("../controllers/usersController");
const { validateUser } = require("../validationMiddleware");

//////////////////////////////

router.post("/register", validateUser, userController.register);

router.post("/login", userController.login);

router.post("/resetpassword", userController.resetMail);

router.get("/reset/:token", userController.resetToken);

router.post("/reset/:token", userController.reset);

router.get("/logout", userController.logout);

module.exports = router;
