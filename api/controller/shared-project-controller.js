var parseDir = require('../middleware/parse-dir');
var db = require("../../hjc_db");
var fs = require("fs");
var fsex = require("fs-extra");

exports.get_shared_project = (req, res, next) => {
  if (req.params.project_id) {
    user_id = req.params.user_id;
    project_id = req.params.project_id;
    query_str = 'SELECT DISTINCT p.project_id, p.project_name, p.author_id, u.email as author_email, sp.viewer_id FROM projects p JOIN shared_projects sp ON p.project_id = sp.project_id JOIN users u ON p.author_id = u.user_id WHERE sp.viewer_id = ? AND p.project_id = ?';
    db.query(query_str, [user_id, project_id], function(err, result) {
      if (err) {
        res.status(200).json({
          message: "Error"
        })
      }
      if (result.length > 0) {
        shared_project_infor = result[0];
        filepath = './public/data/' + shared_project_infor.author_id + '/' + shared_project_infor.project_name;
        res.status(200).json({
          message: "Success",
          shared_project: shared_project_infor,
          data: parseDir.parseDirectory(filepath, shared_project_infor.project_name)
        })
      }
      else {
        res.status(200).json({
          message: "Error"
        })
      }
    })
  }
  else {
    user_id = req.params.user_id;
    query_str = 'SELECT DISTINCT p.project_id, p.author_id, u.email as author_email, p.project_name, sp.viewer_id FROM shared_projects sp JOIN projects p ON sp.project_id = p.project_id JOIN users u ON p.author_id = u.user_id WHERE sp.viewer_id = ?';
    db.query(query_str, [user_id], function (err, result) {
      if (err) {
        res.status(200).json({
          message: "Error"
        })
      }
      else {
        res.status(200).json({
          message: "Success",
          shared_projects: result
        })
      }
    })
  }
}
