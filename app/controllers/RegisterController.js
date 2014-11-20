var AuthType = require('../constants/AuthType');
module.exports = {
	index: function(req, res, model, config) {
		res.view({
			error: req.error(),
			req: req
		});
	},

	execute: function(req, res, model, config) {
		var ip = req.headers['x-forwarded-for'] || 
		req.connection.remoteAddress || 
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;

		var options = {ip: ip};
		if(config.user.register.autoLogin) {
			options.autoLogin = true;
			options.req = req;
		}

		model.get('User').register(
			AuthType.USERNAME,
			req.body,
			options,
			config,
			function(err, result) {
				if(err) {
					console.log(err);
					res.error(err);
					return res.redir('/register');
				}

				console.log(result);
				
				return res.redirect(303, config.user.register.redirect || '/');
			}
		);
	},

	test: function(req, res, models, config) {
		
	}
};