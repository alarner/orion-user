module.exports = {
	index: function(req, res, model, config) {
		if(!req.hasOwnProperty('parsedUrl') ||
			!req.parsedUrl.hasOwnProperty('query') ||
			!req.parsedUrl.query.hasOwnProperty('query')) {

			return res.api.setError('Missing query parameter.', 400).send();
		}

		var limit = parseInt(req.parsedUrl.query.limit) || 20;
		var page = parseInt(req.parsedUrl.query.page) || 1;

		limit = Math.min(limit, 250); // Don't let us query more than 250 at a time
		page = Math.max(page, 1); // Don't let the page be less than 1

		model.get('User').findAndCountAll({
			where: ['username like ?', '%' + req.parsedUrl.query.query + '%'],
			limit: limit,
			offset: (page-1)*limit
		}, {raw: true}).then(function(users) {
			res.api.setMetadata({
				count: users.count,
				page: {
					max: Math.ceil(users.count/limit),
					current: page
				}
			});
			return res.api.setData(users.rows).send();
		}, function(err) {
			return res.api.setError(err, 500).send();
		});
	}
};