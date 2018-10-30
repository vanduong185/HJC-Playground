var express = require("express");
var bodyParser = require('body-parser');
var db = require('./hjc_db');
var crypto = require('./crypto');
var projectRoutes = require('./api/routes/project');
var sharedProjectRoutes = require('./api/routes/shared_project');
var playgroundRoutes = require('./api/routes/playground');
var userRoutes = require('./api/routes/user');
var jwt = require('jsonwebtoken');
var config = require('./config');

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/views/index.html");
});

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

app.use("/projects", projectRoutes);
app.use("/playground", playgroundRoutes);
app.use("/users", userRoutes);
app.use("/shared_projects", sharedProjectRoutes);

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
