var express = require("express");
var router = express.Router();
var auth = require('../middleware/check-auth');
var ProjectsController = require('../controller/project-controller');

router.get("/:user_id?/:options?", auth.check, ProjectsController.get_project);
router.post("/:user_id?", auth.check, ProjectsController.create_project);
router.delete("/:user_id?/:project_id?", auth.check, ProjectsController.delete_project);
router.post("/:user_id?/:project_id?/share", auth.check, ProjectsController.share_project);
router.put("/:user_id?/:project_id?", auth.check, ProjectsController.update_project);

module.exports = router;
