const jwt = require('jsonwebtoken');
var config = require('../../config');
var db = require('../../hjc_db');
var crypto = require('../../crypto');

exports.check = (req, res, next) => {
	try {
		const token = req.headers.authorization;
		if (!token) {
			res.status(200).json({
				auth: false,
				message: "No token provided."
			})
		}
		else {
			jwt.verify(token, config.secret, function (err, decoded) {
				if (err) {
					res.status(200).json({
						auth: false,
						message: 'Auth failed'
					});
				}

				user = decoded.user;
				if (user.email && user.password) {
					query_str = "SELECT * FROM users WHERE email = ?";
					db.query(query_str, [user.email], function (err, result) {
						if (err) {
							res.status(200).json({
								auth: false,
								message: 'Auth failed'
							});
						}

						if (result.length <= 0) {
							res.status(200).json({
								auth: false,
								message: 'Auth failed'
							});
						}
						else {
							password = result[0].password;
							crypto.comparePassword(user.password, password, function (err, isPassMatch) {
								if (err) {
									res.status(200).json({
										auth: false,
										message: 'Auth failed'
									});
								}

								next();
							})
						}
					})
				}
				else {
					res.status(200).json({
						auth: false,
						message: 'Auth failed'
					});
				}
			})
		}
	} catch (error) {
		return res.status(200).json({
			auth: false,
			message: 'Auth failed'
		});
	}
};
