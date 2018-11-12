var express = require("express");
var router = express.Router();
var checkAuth = require('../middleware/check-auth');
var ProjectsController = require('../controller/project-controller');

router.get("/:user_id?/:project_id?", ProjectsController.get_project);
router.post("/:user_id?", ProjectsController.create_project);
router.delete("/:user_id?/:project_id?", ProjectsController.delete_project);
router.post("/:user_id?/:project_id?/share", ProjectsController.share_project);
router.put("/:user_id?/:project_id?", ProjectsController.update_project);

module.exports = router;
