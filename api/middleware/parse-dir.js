var fs = require('fs');
var path = require('path');

var parser = {
  parseDirectory : (filepath, project_name) => {
    var stats = fs.lstatSync(filepath);
    arr = filepath.split("/");
    arr.splice(0, arr.indexOf(project_name));
    fpath = arr.join("/");
    var info = {
      path: fpath,
      text: path.basename(filepath)
    };

    if (stats.isDirectory()) {
      info.type = "folder";
      info.children = fs.readdirSync(filepath).map(function (child) {
        return parser.parseDirectory(filepath + '/' + child, project_name);
      });
    }
    else {
      if (info.text.includes(".html")) {
        info.type = "file-html";
      }
      else if (info.text.includes(".css")) {
        info.type = "file-css";
      }
      else if (info.text.includes(".js")) {
        info.type = "file-js";
      }
      else {
        info.type = "file";
      }

      if (fs.readFileSync(filepath).toString().length == 0) {
        info.content = " ";
      }
      else {
        info.content = fs.readFileSync(filepath).toString();
      }
    }

    return info;
  }
}

module.exports = parser;
