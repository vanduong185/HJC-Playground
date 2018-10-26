var fs = require("fs");
var fsex = require("fs-extra");
var uuid = require("uuid");
var parser = require('../middleware/parse-dir');

exports.edit_project = (req, res, next) => {
  console.log(req.body);
  var data = req.body;
  var root_dir = './public/data/' + data.user_id + "/";
  switch (data.flag) {
    case "change": {
      fs.writeFile(root_dir + data.file_path, data.content, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(200);
        }
      });
      break;
    }
    case "create file": {
      fs.writeFile(root_dir + data.file_path, data.content, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(200);
        }
      });
      break;
    }
    case "create folder": {
      fs.mkdir(root_dir + data.file_path, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(200);
        }
      });
      break;
    }
    case "delete folder": {
      fs.rmdir(root_dir + data.file_path, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(200);
        }
      })
    }
    case "delete file": {
      fs.unlink(root_dir + data.file_path, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(200);
        }
      })
    }
    case "rename file": {
      fs.rename(root_dir + data.old_path, root_dir + data.new_path, function (err) {
        if (err) {

        }
        else {
          res.send(200);
        }
      })
    }
    case "rename folder": {
      fs.rename(root_dir + data.old_path, root_dir + data.new_path, function (err) {
        if (err) {

        }
        else {
          res.send(200);
        }
      })
    }
  }
};

exports.get_guest_project = (req, res, next) => {
  console.log(req);
  guest_project_name = uuid();
  guest_project_path = './public/data/guest/' + guest_project_name;
  file_index = guest_project_path + '/' + "index.html";
  folder_js = guest_project_path + '/' + "javascript";
  file_config = folder_js + '/' + "config.js";
  file_yjs = folder_js + '/' + "your_js.js";
  folder_css = guest_project_path + '/' + "style";
  file_css = folder_css + '/' + "style.css";

  fs.mkdir(guest_project_path, function (error) {
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
      res.status(200).json({
        message: "success",
        guest_project: guest_project_name,
        data: parser.parseDirectory(guest_project_path, guest_project_name)
      })
    }
  })
}
