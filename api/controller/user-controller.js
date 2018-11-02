var db = require("../../hjc_db");
var crypto = require("../../crypto");
var jwt = require("jsonwebtoken");

exports.create_user = (req, res, next) => {
  var infor = req.body.user;

  query_str = "SELECT * FROM users WHERE email = ?";
  db.query(query_str, [infor.email], function (err, result) {
    if (result.length > 0) {
      res.status(200).json({
        message: "Email existed"
      })
    }
    else {
      crypto.cryptPassword(infor.password).then(function (hassPass) {
        if (hassPass) {
          let query_str = 'INSERT INTO users (email, password, nickname, isAdmin) VALUES ?';
          var values = [
            [
              infor.email,
              hassPass,
              infor.nickname,
              0
            ]
          ];
          db.query(query_str, [values], function (err, result) {
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
  })
}

exports.login = (req, res, next) => {
  data = req.body;
  query_str = 'SELECT * FROM users WHERE email = "' + data.username + '"';
  db.query(query_str, function (err, result) {
    if (err) {
      res.json({
        message: "fail"
      })
    }
    if (result.length > 0) {
      user = result[0];
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
