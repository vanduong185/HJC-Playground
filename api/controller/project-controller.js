var parseDir = require('../middleware/parse-dir');
var db = require("../../hjc_db");
var fs = require("fs");
var fsex = require("fs-extra");

exports.get_project = (req, res, next) => {
  if (req.params.project_id) {
    user_id = req.params.user_id;
    project_id = req.params.project_id;
    query_str = "SELECT * FROM shared_projects WHERE project_id = ?";
    db.query(query_str, [project_id], function (err, result) {
      if (err) {
        res.status(200).json({
          message: "Error"
        })
      }
      else if (result.length > 0) {
        query_str = 'SELECT * FROM projects p JOIN shared_projects sp ON p.project_id = sp.project_id JOIN users u ON sp.viewer_id = u.user_id WHERE p.author_id = ? AND p.project_id = ?';
        db.query(query_str, [user_id, project_id], function (err, result) {
          if (result.length > 0) {
            var viewers = [];
            result.map(ojb => {
              viewers.push(ojb.email);
            })
            project_data = {
              project_id: result[0].project_id,
              project_name: result[0].project_name,
              author_id: result[0].author_id,
              viewers: viewers
            }
            filepath = './public/data/' + project_data.author_id + '/' + project_data.project_name;
            res.status(200).json({
              project: project_data,
              data: parseDir.parseDirectory(filepath, project_data.project_name)
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
        query_str = 'SELECT * FROM projects WHERE author_id = ? AND project_id = ?';
        db.query(query_str, [user_id, project_id], function (err, result) {
          if (result.length > 0) {
            project_data = {
              project_id: result[0].project_id,
              project_name: result[0].project_name,
              author_id: result[0].author_id,
              viewers: []
            }
            filepath = './public/data/' + project_data.author_id + '/' + project_data.project_name;
            res.status(200).json({
              project: project_data,
              data: parseDir.parseDirectory(filepath, project_data.project_name)
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
  user_id = req.params.user_id;
  new_project = req.body.new_project;
  query_str = 'SELECT project_id FROM projects WHERE project_name = ? AND author_id = ?';
  db.query(query_str, [new_project.name, user_id], function (err, result) {
    if (err) {
      res.status(200).json({
        message: "Error"
      })
    }
    if (result.length > 0) {
      res.status(200).json({
        message: "Already exist"
      })
    }
    else {
      query_str = ' INSERT INTO projects (project_name, author_id) VALUES ?';
      values = [
        [new_project.name, user_id]
      ];

      if (!fs.existsSync('./public/data/' + user_id)) {
        fs.mkdirSync('./public/data/' + user_id);
      }

      project_path = './public/data/' + user_id + '/' + new_project.name;
      file_index = project_path + '/index.html';
      folder_js = project_path + '/script';
      file_config = project_path + '/config.js';
      file_yjs = folder_js + '/my_script.js';
      folder_css = project_path + '/style';
      file_css = folder_css + '/my_style.css';

      fs.mkdir(project_path, function (error) {
        if (error) {
          console.log(err);
          res.status(200).json({
            message: "Error"
          })
        }
        else {
          fs.writeFileSync(file_index, '<!DOCTYPE html>\n<html>\n  <head>\n    <link rel="stylesheet" href="style/my_style.css" type="text/css"/>\n  </head>\n  <body>\n\t\t<div>Hello world</div>\n    <script src="config.js" type="text/javascript"></script>\n    <script src="script/my_script.js" type="text/javascript"></script>\n  </body>\n</html>\n');
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
  })
}

exports.delete_project = (req, res, next) => {
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
      project_path = './public/data/' + user_id + '/' + project_name;
      fsex.remove(project_path, function (err) {
        if (err) {
          res.status(200).json({
            message: "Error"
          })
        }
        else {
          query_str = "DELETE FROM projects WHERE author_id = ? AND project_id = ?";
          db.query(query_str, [user_id, project_id], function (err, result) {
            if (err) {
              res.status(200).json({
                message: "Error"
              })
            }
            if (result) {
              res.status(200).json({
                message: "deleted"
              })
            }
          })
        }
      })
    }
    else {
      res.status(200).json({
        message: "Error"
      })
    }
  })
}

exports.share_project = (req, res, next) => {
  viewers = req.body.viewers;
  user_id = req.params.user_id;
  project_id = req.params.project_id;

  query_str = "DELETE FROM shared_projects WHERE project_id = ?";
  db.query(query_str, [project_id], function (err) {
    if (err) {
      res.status(200).json({
        message: "Error"
      })
    }
    else if (viewers.length == 0) {
      res.status(200).json({
        message: "Success"
      })
    }
    else {
      query_str = "SELECT user_id FROM users WHERE email IN (?)";
      db.query(query_str, [viewers], function (err, result) {
        if (err || !result || result.length != viewers.length) {
          res.status(200).json({
            message: "Error"
          })
        }
        else {
          values = [];
          for (i = 0; i < result.length; i++) {
            tmp = [project_id, result[i].user_id];
            values.push(tmp);
          }
          query_str = "INSERT INTO shared_projects (project_id, viewer_id) VALUE ?";
          db.query(query_str, [values], function (err, result) {
            if (err || !result) {
              res.status(200).json({
                message: "Error"
              })
            }
            else {
              res.status(200).json({
                message: "Success"
              })
            }
          })
        }
      })
    }
  })
}

exports.update_project = (req, res, next) => {
  user_id = req.params.user_id;
  project_id = req.params.project_id;
  update_project = req.body.update_project;

  query_str = "SELECT project_name FROM projects WHERE project_id = ?";
  db.query(query_str, [project_id], function (err, result) {
    if (err) {
      res.status(200).json({
        message: "Error"
      })
    }
    if (result.length > 0) {
      old_name = result[0].project_name;
      query_str = "SELECT * FROM projects WHERE author_id = ? AND project_name = ?";
      db.query(query_str, [user_id, update_project.project_name], function(err, result) {
        if (err) {
          res.status(200).json({
            message: "Error"
          })
        }
        if (result.length > 0) {
          res.status(200).json({
            message: "Already exist"
          })
        }
        else {
          fsex.rename("./public/data/" + user_id + "/" + old_name, "./public/data/" + user_id + "/" + update_project.project_name, function(err) {
            if (err) {
              res.status(200).json({
                message: "Error"
              })
            }
            else {
              query_str = "UPDATE projects SET project_name = ? WHERE author_id = ? AND project_id = ?";
              db.query(query_str, [update_project.project_name, user_id, project_id], function(err, result) {
                if (err) {
                  res.status(200).json({
                    message: "Error"
                  })
                }
                else {
                  res.status(200).json({
                    message: "Success"
                  })
                }
              })
            }
          })
        }
      })
    }
    else {
      res.status(200).json({
        message: "Error"
      })
    }
  })
}
