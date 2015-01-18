module.exports = {
	index: function(req, res, model, config) {
		console.log(req);
		res.view({
			query: false
		});
	}
};