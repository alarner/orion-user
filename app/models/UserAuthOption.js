var async = require('async');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var UserAuthType = require('./User').authType;
var UserAuthError = require('./User').authType;

var UAO = {
	attributes: {
		userId: {
			type: 'integer',
			require: true
		},
		authType: {
			type: 'integer',
			require: true
		},
		authIdentifier: {
			type: 'string',
			require: false
		},
		authPassword: {
			type: 'string',
			require: true
		},
		ip: {
			type: 'string',
			require: true
		},
		expiresAt: {
			type: 'datetime',
			require: false
		},

		changePassword: function(newPassword, cb) {
			var self = this;
			UAO.handler[this.authType].generatePassword(newPassword, function(err, generatedPassword) {
				if(err) return error.trace(err, cb);
				self.authPassword = generatedPassword;
				self.save(cb);
			});
		}
	},
	handler: {},
	isRegistered: function(authType, authIdentifier, cb) {
		this.find({authType: authType, authIdentifier: authIdentifier}, function(err, authOptions) {
			if(err) {
				error.trace(err, cb);
			}
			else {
				cb(null, authOptions.length > 0);
			}
		});
	}
};

UAO.handler[UserAuthType.USERNAME] = {
	authenticate: function(identifier, plaintextPassword, options, cb) {
		options.algo = options.algo || 'bcrypt';
		async.series({
			checkAttempts: function(cb) {
				var sql = '\
				SELECT COUNT(*) AS `num`\
				FROM `userAuthAttempts`\
				WHERE\
					`authType`=? AND\
					`authIdentifier`=? AND\
					`authError` IS NOT NULL AND\
					`createdAt` > DATE_SUB(NOW(), INTERVAL ? MINUTE)';
				UserAuthOption.query(
					sql,
					[UserAuthType.USERNAME, identifier, sails.config.user.failedAttemptTimeLimit],
					function(err, count) {
						if(err) {
							error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'An unknown error occurred.'}, cb)
						}
						else if(count[0].num >= sails.config.user.maxFailedAttempts) {
							cb({code: UserAuthError.MAX_FAILED_ATTEMPTS, message: 'Too many failed login attempts.'});
						}
						else {
							cb(null);
						}
					}
				);
			},
			authOption: function(cb) {
				var sql = '\
				SELECT * FROM `userAuthOptions`\
				WHERE `authType`=? AND `authIdentifier`=? LIMIT 1';
				UserAuthOption.query(
					sql,
					[UserAuthType.USERNAME, identifier],
					function(err, authOption) {
						if(err) {
							error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'An unknown error occurred.'}, cb)
						}
						else if(authOption.length == 0) {
							cb({code: UserAuthError.UNKNOWN_IDENTIFIER, message: 'We couldn\'t find your email address.'});
						}
						else {
							authOption = new UserAuthOption._model(authOption[0]);
							// New authentication method
							if(!authOption.nonce) {
								bcrypt.compare(plaintextPassword, authOption.authPassword, function(err, res) {
									if(err) {
										error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'An unknown error occurred.'}, cb);
									}
									else if(!res) {
										cb({code: UserAuthError.INVALID_PASSWORD, message: 'The password that you entered isn\'t correct.'});
									}
									else {
										cb(null, authOption);
									}
								});
							}
							// Old authentication method
							else {
								var hmac = crypto.createHmac('sha512', sails.config.user.passwordSalt);
								hmac.write(plaintextPassword+authOption.nonce);
								var hashed = hmac.digest('hex');
								if(hashed != authOption.authPassword) {
									cb({code: UserAuthError.INVALID_PASSWORD, message: 'The password that you entered isn\'t correct.'});
								}
								else {
									cb(null, authOption);
									// Update to new authentication method
									bcrypt.genSalt(10, function(err, salt) {
										if(err) return error.trace(err);
										bcrypt.hash(plaintextPassword, salt, function(err, hash) {
											if(err) return error.trace(err);
											authOption.nonce = '';
											authOption.authPassword = hash;
											authOption.save(function(err) {
												if(err) error.trace(err);
											});
										});
									});
								}
							}
						}
					}
				);
			}
		}, function(err, seriesResults) {
			var attempt = {
				authType: UserAuthType.USERNAME,
				authIdentifier: identifier,
				ip: options.ip || null
			};
			if(err) {
				attempt.authError = err.code;
			}

			UserAuthAttempt.create(attempt, function(createAttemptError, userAuthAttempt) {
				if(createAttemptError) {
					error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'An unknown error occurred.'}, cb);
				}
				else if(!err && seriesResults) {
					User.findOne(seriesResults.authOption.userId, function(err, user) {
						if(err) {
							error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'An unknown error occurred.'}, cb);
						}
						else {
							user.loggedInAt = new Date();
							user.save(function(err, u) {
								if(err) {
									error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'An unknown error occurred.'}, cb);
								}
								else {
									cb(null, user);
								}
							});
						}
					});
				}
				else {
					cb(err);
				}
			});
		});

	},

	register: function(options, cb) {
		var self = this;
		if(!options.authIdentifier) {
			return cb({code: UserAuthError.MISSING_IDENTIFIER, message: 'You need to enter a username.'});
		}
		else if(!options.authPassword) {
			return cb({code: UserAuthError.MISSING_PASSWORD, message: 'You need to enter a password.'});
		}
		else if(!options.userId) {
			return cb({code: UserAuthError.MISSING_USER_ID, message: 'Missing user id.'});
		}
		UserAuthOption.isRegistered(UserAuthType.USERNAME, options.authIdentifier, function(err, isRegistered) {
			if(err) return cb({code: UserAuthError.UNKNOWN_ERROR, message: err});
			if(isRegistered) return cb({code: UserAuthError.ALREADY_REGISTERED, message: 'It looks like you have already registered.'});
			self.generatePassword(options.authPassword, function(err, generatedPassword) {
				if(err) return error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'There was an error creating your account.'}, cb);
				UserAuthOption.create({
					userId: options.userId,
					authType: UserAuthType.USERNAME,
					authIdentifier: options.authIdentifier,
					authPassword: generatedPassword,
					ip: options.req.ip
				}, function(err, authOption) {
					if(err) return error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'There was an error creating your account.'}, cb);
					cb(null, authOption);
				});
			});
		});
	},

	generatePassword: function(password, cb) {
		bcrypt.genSalt(10, function(err, salt) {
			if(err) return error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'There was an error creating your account.'}, cb);
			bcrypt.hash(password, salt, function(err, hash) {
				if(err) return error.trace(err, {code: UserAuthError.UNKNOWN_ERROR, message: 'There was an error creating your account.'}, cb);
				cb(null, hash);
			});
		});
	}
}

module.exports = UAO;
