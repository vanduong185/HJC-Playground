var express = require("express");
var router = express.Router();
var playgroundController = require("../controller/playground-controller");

router.post("/", playgroundController.edit_project);

module.exports = router;
