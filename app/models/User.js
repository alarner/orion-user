var async = require('async');
var User = {
	authType: {
		USERNAME: 1
	},
	authError: {
		UNKNOWN_ERROR: 1,
		UNKNOWN_TYPE: 2,
		MAX_FAILED_ATTEMPTS: 3,
		UNKNOWN_IDENTIFIER: 4,
		EXPIRED: 5,
		INVALID_PASSWORD: 6
	},
	attributes: {
		email: {
			type: 'string',
			required: false
		},
		emailVerified: {
			type: 'boolean',
			required: true,
			defaultsTo: false
		},
		accountVerified: {
			type: 'boolean',
			required: true,
			defaultsTo: false
		},
		accountDisabled: {
			type: 'boolean',
			required: true,
			defaultsTo: false
		},
		loggedInAt: {
			type: 'datetime',
			required: false
		},
		authOptions: {
			collection: 'UserAuthOption',
			via: 'userId'
		},
		keys: {
			collection: 'UserKey',
			via: 'userId'
		},
		permissions: {
			collection: 'UserPermission',
			via: 'userId'
		},

		isLoggedIn: function() {
			return this.id ? true : false;
		},

		loadPermissions: function(cb) {
			cb();
			// var self = this;
			// UserPermission.find({ user_id: this.id }).done(function(err, permissions) {
			// 	if(!err) {
			// 		self.permissions = {};
			// 		for(var i=0; i<permissions.length; i++) {
			// 			var p = permissions[i];
			// 			self.permissions[p.permission_code.toString()] = p.value;
			// 		}
			// 	}
			// 	cb();
			// });
		},

		hasPermission: function(permissionId) {
			permissionId = permissionId.toString();
			return this.permissions.hasOwnProperty(permissionId) && this.permissions[permissionId];
		},

		sendPasswordResetEmail: function(host, cb) {
			if(!this.id) return cb('Cannot send password reset email without a valid user id.');

			var self = this;
			this.generateKey(
				sails.config.resetPasswordKey.length,
				UserKey.type.RESET_PASSWORD,
				sails.config.resetPasswordKey.lifetimeInHours,
				function(err, userKey) {
					if(err) return cb(err);
					var emailTemplates = require('email-templates');
					var params = {
						user: self,
						host: host,
						userKey: userKey
					};
					emailTemplates('views/emails', function(err, template) {
						template('reset-password', params, function(err, html, text) {
							var transport = nodemailer.createTransport(sails.config.email.type, sails.config.email.params);
							transport.sendMail({
								from: '900dpi Password Reset <hi@900dpi.com>',
								to: self.email,
								subject: 'Reset your password',
								html: html,
								text: text
							}, function(err, responseStatus) {
								if(err) return error.trace(err, cb);
								cb();
							});
						});
					});
				}
			);
		},

		generateKey: function(length, type, lifetimeInHours, cb) {
			var self = this;
			var run = function(cb) {
				var md5 = crypto.createHash('md5');
				md5.update(self.toJSON()+uid(15));
				var key = md5.digest('hex');
				UserKey.findOne({key: key}, function(err, userKey) {
					if(userKey) return run(cb);
					cb(err, key);
				});
			};

			run(function(err, key) {
				var expiresAt = new Date();
				expiresAt.setHours(expiresAt.getHours()+lifetimeInHours);
				UserKey.create({
					key: key,
					userId: self.id,
					type: type,
					expiresAt: expiresAt,
					usedAt: null
				}, cb);
			});
		},

		changeAuthPassword: function(authType, password, cb) {
			UserAuthOption.findOne({userId: this.id, authType: authType}, function(err, authOption) {
				if(err) return error.trace(err, cb);
				authOption.changePassword(password, function(err) {
					if(err) return error.trace(err, cb);
					cb();
				});
			});
		}
	},

	authenticate: function(type, identifier, password, options, cb) {
		if(!UserAuthOption.handler.hasOwnProperty(type)) {
			return cb({
				code: this.authError.UNKNOWN_TYPE,
				message: 'Unknown auth type: '+type
			}, null);
		}

		return UserAuthOption.handler[type].authenticate(identifier, password, options, cb);
	},

	register: function(type, data, options, UserAuthOption, config, cb) {
		var self = this;
		var data = data || {};
		if(!options) options = {};
		options.autoLogin = options.autoLogin || config.user.autoLogin;

		if(!UserAuthOption.handler.hasOwnProperty(type))
			return cb(_.extend({params: {type: type}}, config.errors.UNKNOWN_AUTH_TYPE));

		var newUser = null;
		async.series({
			isRegistered: function(cb) {
				console.log('isRegistered');
				UserAuthOption.isRegistered(User.authType.USERNAME, data.username, function(err, registered) {
					if(err) return cb(config.errors.CHECKING_IF_REGISTERED);
					if(registered) return cb(config.errors.ALREADY_REGISTERED);
					cb();
				});
			},
			user: function(cb) {
				console.log('user');
				self.create(
					data,
					function(err, user) {
						if(err) return error.trace(
							JSON.stringify(err),
							config.errors.ACCOUNT_CREATION,
							cb
						);
						newUser = user;
						cb(null, user);
					}
				);
			},
			userAuthOption: function(cb) {
				console.log('userAuthOption');
				data.userId = newUser.id;
				data.ip = options.ip;
				UserAuthOption.handler[type].register(data, config, UserAuthOption, cb);
			}
		}, function(err, results) {
			console.log('finished');
			if(err) return cb(err);
			delete results.isRegistered;
			if(options.autoLogin && options.req) {
				options.req.session.user = results.user.toObject();
				options.req.user = results.user;
			}
			async.parallel([
				function(cb) {options.req.user.loadPermissions(cb)},
			],
			function(err) {
				if(err) return error.trace(err, cb);
				cb(null, results);
			});
		});
	}
};

module.exports = User;
