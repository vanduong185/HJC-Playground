var express = require("express");
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./hjc_db');
var crypto = require('./crypto');

// var pass = "123456";
// crypto.cryptPassword(pass).then(result => {
//   console.log(result)
// });

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/views/index.html");
});

app.post("/login", function (req, res) {
  data = req.body;
  query_str = 'SELECT * FROM users WHERE email = "' + data.username + '"';
  db.query(query_str, function (err, result) {
    if (result.length > 0) {
      user = result[0];
      crypto.comparePassword(data.password, user.password, function(err, isPassMatch) {
        if (isPassMatch) {
          res.json({
            message: "success",
            data: user
          });
        }
        else {
          res.json({
            message: "fail"
          })
        }
      })
    }
    else {
      res.json({
        message: "fail"
      })
    }

    if (err) {
      res.json({
        message: "fail"
      })
    }
  });
})

app.get("/users", function (req, res) {
  var person1 = {
    name: "Duong",
    age: "18"
  }

  var person2 = {
    name: "hihi Duong",
    age: "20"
  }

  var person3 = {
    name: "Duongasda",
    age: "182"
  }

  var listUser = [person1, person2, person3];
  res.json(listUser);
});

app.get("/playground", function (req, res) {
  var username = 'lab';
  var user_dir = './public/data/' + username;

  res.json(parseDirectory(user_dir, username));
});

app.post("/playground", function (req, res) {
  console.log(req.body);
  var data = req.body;
  var root_dir = './public/data/';
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
});

function parseDirectory(filename, username) {
  var stats = fs.lstatSync(filename);
  arr = filename.split("/");
  arr.splice(0, arr.indexOf(username));
  fpath = arr.join("/");
  var info = {
    path: fpath,
    text: path.basename(filename)
  };

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(filename).map(function (child) {
      return parseDirectory(filename + '/' + child, username);
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

    if (fs.readFileSync(filename).toString().length == 0) {
      info.content = " ";
    }
    else {
      info.content = fs.readFileSync(filename).toString();
    }
  }

  return info;
}

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
