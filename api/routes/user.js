var express = require("express");
var router = express.Router();
var UserController = require('../controller/user-controller');

router.post("/signup", UserController.create_user);
router.post("/login", UserController.login);
router.post("/profile", UserController.updateInfo);


module.exports = router;
