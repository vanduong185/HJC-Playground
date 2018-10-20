var bcrypt = require('bcrypt');

var crypto = {};

// crypto.cryptPassword = function (plainPass, callback) {
//   bcrypt.genSalt(10, function(err, salt) {
//     if (err) 
//       return callback(err);

//     bcrypt.hash(plainPass, salt, function(err, hashPass) {
//       return callback(err, hashPass);
//     });
//   })
// }
crypto.cryptPassword = (plainPass) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10).then(salt => {
      bcrypt.hash(plainPass, salt).then(result => {
        resolve(result)
      })
    }, error => reject(error))
  })
}

crypto.comparePassword = function(plainPass, hashword, callback) {
  bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
    return err == null ? callback(null, isPasswordMatch) : callback(err);
  });
};

module.exports = crypto;
