var express = require("express");
var router = express.Router();
var auth = require('../middleware/check-auth');
var UserController = require('../controller/user-controller');

router.post("/signup", UserController.create_user);
router.post("/login", UserController.login);
router.post("/profile", auth.check, UserController.updateInfo);
router.get("/:options?", auth.check, UserController.get_user);
router.delete("/:user_id", auth.check, UserController.delete_user);

module.exports = router;
