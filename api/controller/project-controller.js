//var project = require('../models/project');
var parseDir = require('../middleware/parse-dir');
var db = require("../../hjc_db");
var fs = require("fs");
var fsex = require("fs-extra");

exports.get_project = (req, res, next) => {
  if (req.params.project_id) {
    user_id = req.params.user_id;
    project_id = req.params.project_id;
    query_str = 'SELECT * FROM projects WHERE author_id = ? AND project_id = ?';
    db.query(query_str, [user_id, project_id], function (err, result) {
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
        res.status(200).json({
          message: "Error"
        })
      }
    })
  }
  else {
    user_id = req.params.user_id;
    query_str = 'SELECT * FROM projects WHERE author_id = ?';
    db.query(query_str, [user_id], function (err, result) {

      if (err) {
        res.status(200).json({
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

exports.create_project = (req, res, next) => {
  console.log(req.body);
  user_id = req.params.user_id;
  new_project = req.body.new_project;
  query_str = ' INSERT INTO projects (project_name, author_id) VALUES ?';
  values = [
    [new_project.name, user_id]
  ];
  project_path = './public/data/' + user_id + '/' + new_project.name;
  file_index = project_path + '/' + "index.html";
  folder_js = project_path + '/' + "javascript";
  file_config = folder_js + '/' + "config.js";
  file_yjs = folder_js + '/' + "your_js.js";
  folder_css = project_path + '/' + "style";
  file_css = folder_css + '/' + "style.css";

  fs.mkdir(project_path, function (error) {
    if (error) {
      res.status(200).json({
        message: "Error"
      })
    }
    else {
      fs.writeFileSync(file_index, '<!DOCTYPE html>\n<html>\n  <head>\n    <link rel="stylesheet" href="style/style.css" type="text/css"/>\n  </head>\n  <body>\n\t\t<div id="title">Hello world</div>\n    <script src="javascript/config.js" type="text/javascript"></script>\n  </body>\n</html>\n');
      fs.mkdirSync(folder_js);
      fs.writeFileSync(file_config, 'window.console.log = function (obj) {\n  if (typeof obj === "object")\n  {\n    obj = JSON.stringify(obj);\n  }\n  message = {\n    type: "log-msg",\n    content: obj\n  }\n\twindow.parent.postMessage(message, \'*\');\n}\n\nwindow.onerror = function(msg, url,line) {\n  arr = url.split("/");\n  error = {\n    position: arr[arr.length-1] + ":" + line,\n    content: msg,\n    type: "error-msg"\n  }\n  window.parent.postMessage(error, \'*\');\n}\n');
      fs.writeFileSync(file_yjs, ' ');
      fs.mkdirSync(folder_css);
      fs.writeFileSync(file_css, ' ');

      db.query(query_str, [values], function (err, result) {
        if (err) {
          res.status(200).json({
            message: "Error"
          })
        }
        if (result) {
          res.status(200).json({
            message: "success",
            data: parseDir.parseDirectory(project_path, new_project.name)
          })
        }
      });
    }
  })
}

exports.delete_project = (req, res, next) => {
  console.log(req.params);
  user_id = req.params.user_id;
  project_id = req.params.project_id;
  project_name = "";
  query_str = "SELECT * FROM projects WHERE author_id = ? AND project_id = ?";
  db.query(query_str, [user_id, project_id], function (err, result) {
    if (err) {
      res.status(200).json({
        message: "Error"
      })
    }
    if (result.length > 0) {
      project_name = result[0].project_name;
    }
    else {
      res.status(200).json({
        message: "Error"
      })
    }
  })

  query_str = "DELETE FROM projects WHERE author_id = ? AND project_id = ?";
  db.query(query_str, [user_id, project_id], function (err, result) {
    if (err) {
      res.status(200).json({
        message: "Error"
      })
    }
    if (result) {
      console.log(result);
      project_path = './public/data/' + user_id + '/' + project_name;
      fsex.remove(project_path, function (err) {
        if (err) {
          res.status(200).json({
            message: "Error"
          })
        }
        else {
          res.status(200).json({
            message: "deleted"
          })
        }
      })
    }
  })
}
