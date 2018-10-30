var db = require("../../hjc_db");
var crypto = require("../../crypto");
var jwt = require("jsonwebtoken");

exports.create_user = (req, res, next) => {
  console.log(req.body);
  var infor = req.body;

  crypto.cryptPassword(infor.password).then(function (value) {
    if (value) {
      let addUser = 'INSERT INTO users (email, password, nickname) VALUES ?';
      var values = [
        [
          infor.email,
          value,
          infor.nickname]
      ];
      db.query(addUser, [values], function (err, result) {
        if (err) {
          res.status(200).json({
            message: "Error"
          })
        }
        if (result) {
          res.status(200).json({
            message: "Success"
          })
        }
      });
    }
  })
}

exports.login = (req, res, next) => {
  data = req.body;
  console.log(data);
  query_str = 'SELECT * FROM users WHERE email = "' + data.username + '"';
  db.query(query_str, function (err, result) {
    if (err) {
      res.json({
        message: "fail"
      })
    }
    if (result.length > 0) {
      user = result[0];
      console.log(process.env.JWT_KEY);
      crypto.comparePassword(data.password, user.password, function (err, isPassMatch) {
        if (isPassMatch) {
          const token = jwt.sign({ 
            email: user.email,
            userId: user.user_id
          },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            })
          res.json({
            message: "success",
            data: user,
            token: token
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
  });
}
