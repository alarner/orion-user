module.exports = {
	index: function(req, res, model, config) {
		if(!req.hasOwnProperty('parsedUrl') ||
			!req.parsedUrl.hasOwnProperty('query') ||
			!req.parsedUrl.query.hasOwnProperty('query')) {

			return res.api.setError('Missing query parameter.', 400).send();
		}
		model.get('User').findAll({
			where: ['username like ?', '%' + req.parsedUrl.query.query + '%']
		}, {raw: true}).then(function(users) {
			return res.api.setData(users).send();
		}, function(err) {
			return res.api.setError(err, 500).send();
		});
		
	}
};