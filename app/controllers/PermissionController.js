var _ = require('lodash');
module.exports = {
	index: function(req, res, model, config) {
		model.get('PermissionGroup').hierarchy(function(err, groups) {
			var getAvailablePermissions = function(config, pluginPath) {
				var availablePermissions = [];
				availablePermissions.push({
					title: pluginPath ? pluginPath.join(' > ') : 'Application',
					permissions: config.permissions || {},
					lookup: pluginPath ? pluginPath.join('::') : null
				});

				_.forOwn(config.plugins, function(pluginConfig, key) {
					var newPluginPath = pluginPath ? pluginPath.slice(0) : [];
					newPluginPath.push(key);
					availablePermissions = availablePermissions.concat(getAvailablePermissions(pluginConfig, newPluginPath));
				});
				return availablePermissions;
			};

			res.view({
				groups: groups.toJSON(),
				availablePermissions: getAvailablePermissions(config.globalConfig),
				host: req.headers.host
			});
		});
	},

	group: function(req, res, model, config) {
		if(!req.info.params.id)
			return res.api.setError(config.errors.MISSING_PERMISSION_GROUP_ID).send();

		model.get('PermissionGroup').flatten(req.info.params.id, function(err, permissionGroup) {
			res.api.setData(permissionGroup).send();
		});
	}
};