module.exports = {
	index: function(req, res, model, config) {
		res.view({
			query: false
		});
	}
};