var fs = require("fs");

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
