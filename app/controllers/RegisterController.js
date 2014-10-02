module.exports = {
	index: function(req, res, models, config) {
		res.view({
			error: req.error(),
			req: req
		});
	},

	execute: function(req, res, models, config) {
		var ip = req.headers['x-forwarded-for'] || 
		req.connection.remoteAddress || 
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;

		var options = {ip: ip};
		if(config.user.autoLogin) {
			options.autoLogin = true;
			options.req = req;
		}

		models.User.register(
			models.User.authType.USERNAME,
			req.body,
			options,
			models.UserAuthOption,
			config,
			function(err, result) {
				if(err) {
					res.error(err);
					return res.redir('/register');
				}
				
				console.log(err, result);
				res.end();
			}
		);
	}
};