var bcrypt = require('bcrypt');

var crypto = {};

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
