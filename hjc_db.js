var mysql = require("mysql");

var con = mysql.createConnection({
  host:     "localhost",
  user:     "root",
  password: "12345678",
  database: "hjc_playground"
});

con.connect(function(err) {
  if (err) {
    console.log(err);
    console.log("Failed to connect to database!");
    return;
  }
  console.log("Successfully connected to database!");
});

module.exports = con;
