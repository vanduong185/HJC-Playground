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

exports.updateInfo = (req, res, next) => {
  var infor = req.body;
  console.log(infor);
  switch (infor.flag) {
    case "update_info": {
      let query_str = 'Update users set nickname = ?, age = ?, jobtitle = ? where id = ?';
      var values = [
        {
          "nickname": infor.nickname,
          "age": infor.age,
          "jobtitle": infor.jobtitle,
          "email": infor.email,
          "id": infor.id
        }
      ];
      // console.log(values[0]);
      db.query(query_str, [values[0].nickname, values[0].age, values[0].jobtitle, values[0].id], function (err, result) {
        if (err) {
          console.log(err);
          res.status(200).json({
            message: "Error"
          })
        }
        if (result) {
          console.log(result);
          res.status(200).json({
            message: "Success"
          })
        }
      });
      break;
    }
    case "change_pass": {
      query_str = 'SELECT * FROM users WHERE id = "' + infor.id + '"';
      db.query(query_str, function (err, result) {
        if (err) {
          res.json({
            message: "fail"
          })
        }
        if (result.length > 0) {
          user = result[0];
          crypto.comparePassword(infor.currentPass, user.password, function (err, isPassMatch) {
            if (isPassMatch) {
              crypto.cryptPassword(infor.newPass).then(function (hassPass) {
                let query_str2 = 'Update users set password = "'
                  + hassPass + '" WHERE id = "' + infor.id + '"';
                db.query(query_str2, function (err, result) {
                  if (err) {
                    console.log(err);
                    res.status(200).json({
                      message: "Error",
                      data : hassPass
                    })
                  }
                  if (result) {
                    // console.log(result);
                    res.status(200).json({
                      message: "Success"
                    })
                  }
                });
              });
            }
            else {
              res.json({
                message: "currentPass is incorrect"
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
      break;
    }
    case "avatar": {
      console.log(infor.flag);
      break;
    }
  }
  // console.log(infor);

}