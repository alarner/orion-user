module.exports = {
	index: function(req, res, model, config) {
		model.get('PermissionGroup').hierarchy(function(err, groups) {
			res.view({
				groups: groups.toObject()
			});
		});
	},
};