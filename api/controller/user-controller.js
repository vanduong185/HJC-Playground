var db = require("../../hjc_db");
var crypto = require("../../crypto");
var jwt = require("jsonwebtoken");
var fs = require('fs');
var config = require('../../config');

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
            user: user
          },
            config.secret,
            {
              expiresIn: "24h"
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
  switch (infor.flag) {
    case "update_info": {
      let query_str = 'Update users set nickname = ?, age = ?, jobtitle = ? where user_id = ?';
      var values = [
        {
          "nickname": infor.nickname,
          "age": infor.age,
          "jobtitle": infor.jobtitle,
          "email": infor.email,
          "id": infor.id
        }
      ];

      db.query(query_str, [values[0].nickname, values[0].age, values[0].jobtitle, values[0].id], function (err, result) {
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
      break;
    }
    case "change_pass": {
      query_str = 'SELECT * FROM users WHERE user_id = "' + infor.id + '"';
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
                  + hassPass + '" WHERE user_id = "' + infor.id + '"';
                db.query(query_str2, function (err, result) {
                  if (err) {
                    res.status(200).json({
                      message: "Error",
                    })
                  }
                  if (result) {
                    res.status(200).json({
                      message: "Success",
                      data: hassPass
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
    default: {
      var images = req.files;
      if (images) {
        images.forEach(function (file) {
          var filename = 'avatar' + '-' + file.originalname;
          fs.rename(file.path, 'public/lib/images/avatar/1/' + filename, function (err) {
            if (err) {
              console.log(err);
            }
            else {
              var avatar = 'lib/images/avatar/1/' + filename;
              let query_str2 = 'Update users set avatar = "'
                + avatar + '" WHERE user_id = "' + infor.id + '"';
              db.query(query_str2, function (err, result) {
                if (err) {
                  res.status(200).json({
                    message: "Error"
                  })
                }
                if (result) {
                  res.status(200).json({
                    message: "Success",
                    data: avatar
                  })
                }
              });
            }
          })
        });
      }
      break;
    }
  }
}

exports.get_user = (req, res, next) => {
  token = req.headers.authorization;

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(200).json({
        auth: false,
        message: 'Failed to authenticate token.'
      });
    }

    user = decoded.user;
    if (user.isAdmin == 1) {
      options = JSON.parse(req.params.options);

      if (options.keyword == null) {
        query_str = "SELECT * FROM users WHERE isAdmin = 0 LIMIT 10 OFFSET ?";
        db.query(query_str, [(options.paginate.page - 1) * 10], function (err, result) {
          if (err) {
            res.status(200).json({
              message: "Error"
            })
          }
          users = result;
          query_str = "SELECT COUNT(*) as amount FROM users WHERE isAdmin = 0";
          db.query(query_str, function (err, result) {
            res.status(200).json({
              users: {
                list: users,
                total_items: result[0].amount,
                per_page: 10
              }
            })
          })
        })
      }
      else {
        query_str = "SELECT * FROM users WHERE isAdmin = 0 AND ( email LIKE ? OR nickname LIKE ? ) LIMIT 10 OFFSET ?";
        db.query(query_str, ["%" + options.keyword + "%", "%" + options.keyword + "%", (options.paginate.page - 1) * 10], function (err, result) {
          if (err) {
            res.status(200).json({
              message: "Error"
            })
          }
          users = result;
          query_str = "SELECT COUNT(*) as amount FROM users WHERE isAdmin = 0 AND ( email LIKE ? OR nickname LIKE ? )";
          db.query(query_str, ["%" + options.keyword + "%", "%" + options.keyword + "%"], function (err, result) {
            res.status(200).json({
              users: {
                list: users,
                total_items: result[0].amount,
                per_page: 10
              }
            })
          })
        })
      }
    }
    else {
      res.status(200).json({
        message: "no permission"
      })
    }
  })
}

exports.delete_user = (req, res, next) => {
  token = req.headers.authorization;

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(200).json({
        auth: false,
        message: 'Failed to authenticate token.'
      });
    }

    user = decoded.user;

    if (user.isAdmin == 1) {
      delete_user_id = req.params.user_id;
      query_str = "SELECT * FROM users WHERE user_id = ?";
      db.query(query_str, [delete_user_id], function (err, result) {
        if (err) {
          res.status(200).json({
            message: "Error"
          })
        }

        if (result.length > 0) {
          query_str = "DELETE FROM users WHERE user_id = ?";
          db.query(query_str, [delete_user_id], function (err, result) {
            if (err) {
              res.status(200).json({
                message: "Error"
              })
            }

            res.status(200).json({
              message: "deleted"
            })
          })
        }
        else {
          res.status(200).json({
            message: "Error"
          })
        }
      })
    }
    else {
      res.status(200).json({
        message: "no permission"
      })
    }
  })
}
