var fs = require("fs");
var fsex = require("fs-extra");
var uuid = require("uuid");
var parser = require('../middleware/parse-dir');
var db = require('../../hjc_db');

exports.edit_project = (req, res, next) => {
  var data = req.body;
  var root_dir = './public/data/' + data.user_id + "/";
  switch (data.flag) {
    case "change": {
      fs.writeFile(root_dir + data.file_path, data.content, function (err) {
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
      });
      break;
    }
    case "create file": {
      fs.stat(root_dir + data.file_path, function (err, stat) {
        if (err == null) {
          res.status(200).json({
            message: "Already exist"
          })
        }
        else if (err.code == 'ENOENT') {
          fs.writeFile(root_dir + data.file_path, data.content, function (err) {
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
          });
        }
      })
      break;
    }
    case "create folder": {
      fs.stat(root_dir + data.file_path, function (err, stat) {
        if (err == null) {
          res.status(200).json({
            message: "Already exist"
          })
        }
        else if (err.code == 'ENOENT') {
          fs.mkdir(root_dir + data.file_path, function (err) {
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
          });
        }
      })
      break;
    }
    case "delete folder": {
      fsex.remove(root_dir + data.file_path, function (err) {
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
      });
      break;
    }
    case "delete file": {
      fs.unlink(root_dir + data.file_path, function (err) {
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
      });
      break;
    }
    case "rename file": {
      fs.stat(root_dir + data.new_path, function (err, stat) {
        if (err == null) {
          res.status(200).json({
            message: "Already exist"
          })
        }
        else if (err.code == 'ENOENT') {
          fs.rename(root_dir + data.old_path, root_dir + data.new_path, function (err) {
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
      break;
    }
    case "rename folder": {
      fs.stat(root_dir + data.new_path, function (err, stat) {
        if (err == null) {
          res.status(200).json({
            message: "Already exist"
          })
        }
        else if (err.code == 'ENOENT') {
          fs.rename(root_dir + data.old_path, root_dir + data.new_path, function (err) {
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
          });
        }
      })
      break;
    }
    case "save project": {
      query_str = "SELECT project_id FROM projects WHERE project_name = ? AND author_id = ?";
      db.query(query_str, [data.new_project_name, data.user_id], function (err, result) {
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
          fsex.move('./public/data/guest/' + data.old_project_name, './public/data/' + data.user_id + '/' + data.old_project_name, function (err) {
            if (err) {
              res.status(200).json({
                message: "Error"
              })
            }
            else {
              fsex.rename('./public/data/' + data.user_id + '/' + data.old_project_name, './public/data/' + data.user_id + '/' + data.new_project_name, function (err) {
                if (err) {
                  fsex.removeSync('./public/data/' + data.user_id + '/' + data.old_project_name);
                  res.status(200).json({
                    message: "Error"
                  })
                }
                else {
                  query_str = "INSERT INTO projects (project_name, author_id) VALUES ?";
                  values = [
                    [data.new_project_name, data.user_id]
                  ];
                  db.query(query_str, [values], function (err, result) {
                    if (err) {
                      res.status(200).json({
                        message: "Error"
                      })
                    }
                    if (result) {
                      query_str = "SELECT project_id FROM projects WHERE project_name = ? AND author_id = ?";
                      db.query(query_str, [data.new_project_name, data.user_id], function (err, result) {
                        if (err) {
                          res.status(200).json({
                            message: "Error"
                          })
                        }
                        if (result.length > 0) {
                          res.status(200).json({
                            message: "Success",
                            project_id: result[0].project_id
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
      break;
  }
};

exports.get_guest_project = (req, res, next) => {
  guest_project_name = uuid();
  guest_project_path = './public/data/guest/' + guest_project_name;
  file_index = guest_project_path + '/index.html';
  folder_js = guest_project_path + '/script';
  file_config = guest_project_path + '/config.js';
  file_yjs = folder_js + '/my_script.js';
  folder_css = guest_project_path + '/style';
  file_css = folder_css + '/my_style.css';

  fs.mkdir(guest_project_path, function (error) {
    if (error) {
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
      res.status(200).json({
        message: "success",
        guest_project: guest_project_name,
        data: parser.parseDirectory(guest_project_path, guest_project_name)
      })
    }
  })
}
