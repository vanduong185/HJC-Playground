var express = require("express");
var router = express.Router();
var checkAuth = require('../middleware/check-auth');
var SharedProjectController = require('../controller/shared-project-controller');

router.get("/:user_id?/:project_id?", SharedProjectController.get_shared_project);

module.exports = router;
