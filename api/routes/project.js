var express = require("express");
var router = express.Router();
var checkAuth = require('../middleware/check-auth');
var ProjectsController = require('../controller/project-controller');

router.get("/:user_id?/:project_id?", ProjectsController.get_project);

module.exports = router;
