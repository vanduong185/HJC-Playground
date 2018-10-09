var express = require("express");
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/",function(req,res){
  res.sendFile( __dirname + "/public/views/index.html");
});

app.get("/users",function(req,res){
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

app.get("/playground", function(req,res) {
  var username = 'DuongPro';
  var user_dir = './public/data/' + username;
  
  res.json(parseDirectory(user_dir));
});

app.post("/playground", function(req,res) {
  console.log(req.body);
  var data_change = req.body;

  fs.writeFile(data_change.file_path, data_change.content, function(err) {
    if (err) {
      console.log(err);
    } 
    else {
      res.send(200);
    }
  })
});

function parseDirectory(filename) {
  var stats = fs.lstatSync(filename);
  var info = {
    path: filename,
    text: path.basename(filename)
  };

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(filename).map(function(child) {
        return parseDirectory(filename + '/' + child);
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
