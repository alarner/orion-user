module.exports = {
	index: function(req, res, model, config) {
		model.get('PermissionGroup').hierarchy(function(err, groups) {
			res.view({
				groups: groups.toJSON()
			});
		});
	},

	group: function(req, res, model, config) {
		if(!req.info.params.id)
			return res.api.setError(config.errors.MISSING_PERMISSION_GROUP_ID).send();

		model.get('PermissionGroup').find({
			where: {
				id: req.info.params.id
			}
		}).then(function(permissionGroup) {
			if(!permissionGroup)
				return res.api.setError(config.errors.UNKNOWN_PERMISSION_GROUP).send();

			permissionGroup.getPermissions().then(function(permissions) {
				permissionGroup.permissions = permissions;
				var pg = permissionGroup.toJSON();
				res.api.setData(pg).send();
			});
		});
	}
};