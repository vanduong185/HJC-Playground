var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/public/views/';

// router.use(function(req, res, next) {
//   console.log("/" + req.method);
//   next();
// });

app.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

// router.get("/hello",function(req,res){
//   res.sendFile(path + "hello_angular.html");
// });
app.use(express.static(__dirname + "/public"));

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

// router.get("/users", function(req, res) {
//   res.sendFile("views/users.html");
// });

// app.use("*",function(req,res){
//   res.sendFile(path + "404.html");
// });

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
