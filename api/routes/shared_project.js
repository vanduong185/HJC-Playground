var express = require("express");
var router = express.Router();
var auth = require('../middleware/check-auth');
var SharedProjectController = require('../controller/shared-project-controller');

router.get("/:user_id?/:options?", auth.check, SharedProjectController.get_shared_project);

module.exports = router;
