var express = require("express");
var fs = require('fs');
var path = require('path');

var app = express();

app.use(express.static(__dirname + "/public"));

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
  var username = 'Duongnv';
  var user_dir = './data/' + username;
  
  res.json(parseDirectory(user_dir));
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
  } else {
    info.type = "file";
    if (fs.readFileSync(filename).toString().length == 0) {
      info.data = " ";
    }
    else {
      info.data = fs.readFileSync(filename).toString();
    }
  }

  return info;
}

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
