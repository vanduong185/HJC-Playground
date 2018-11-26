var express = require("express");
var bodyParser = require('body-parser');
var projectRoutes = require('./api/routes/project');
var sharedProjectRoutes = require('./api/routes/shared_project');
var playgroundRoutes = require('./api/routes/playground');
var userRoutes = require('./api/routes/user');
var multer = require('multer');


var app = express();
app.use(multer({dest:'./uploads'}).any());

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/views/index.html");
});

app.use("/projects", projectRoutes);
app.use("/playground", playgroundRoutes);
app.use("/users", userRoutes);
app.use("/shared_projects", sharedProjectRoutes);

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});
