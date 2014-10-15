var _ = require('lodash');
module.exports = {
	index: function(req, res, model, config) {
		model.get('PermissionGroup').hierarchy(function(err, groups) {
			var getAvailablePermissions = function(config, pluginPath) {
				pluginPath = pluginPath || ['Application'];
				var availablePermissions = [];
				availablePermissions.push({
					title: pluginPath.join(' > '),
					permissions: config.permissions || {}
				});

				_.forOwn(config.plugins, function(pluginConfig, key) {
					var newPluginPath = pluginPath.slice(0);
					newPluginPath.push(key);
					availablePermissions.concat(getAvailablePermissions(pluginConfig, newPluginPath));
				});
				return availablePermissions;
			};

			res.view({
				groups: groups.toJSON(),
				availablePermissions: getAvailablePermissions(config.globalConfig)
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