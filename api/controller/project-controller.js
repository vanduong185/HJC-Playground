//var project = require('../models/project');
var parseDir = require('../middleware/parse-dir');
var db =  require("../../hjc_db");

exports.get_project = (req, res, next) => {
  if (req.params.project_id) {
    user_id = req.params.user_id;
    project_id = req.params.project_id;
    query_str =  'SELECT * FROM projects WHERE author_id = ? AND project_id = ?';
    db.query(query_str, [user_id, project_id], function(err, result){
      if (result.length > 0) {
        project = result[0];
        filepath = './public/data/' + project.author_id + '/' + project.project_name;
        res.status(200).json({
          project: result[0],
          data: parseDir.parseDirectory(filepath, project.project_name)
        })
      }
      else {
        res.status(200).json({
          message: "Can not found project"
        })
      }

      if (err) {
        res.status(404).json({
          message: "Error"
        })
      }
    })
  }
  else {
    user_id = req.params.user_id;
    query_str = 'SELECT * FROM projects WHERE author_id = ?';
    db.query(query_str, [user_id], function(err, result) {
      
      if (err) {
        res.status(404).json({
          message: "Error"
        })
      }

      if (result.length > 0) {
        res.status(200).json({
          projects: result
        })
      }
      else {
        res.status(200).json({
          message: "No project"
        })
      }
    })
  }
}
