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
	},

	groupPermission: function(req, res, model, config) {
		if(!req.info.params.groupId)
			return res.api.setError(config.errors.MISSING_PERMISSION_GROUP_ID).send();

		if(!req.info.params.permissionCode)
			return res.api.setError(config.errors.MISSING_PERMISSION_CODE).send();

		if(!req.body.value)
			return res.api.setError(config.errors.MISSING_PERMISSION_VALUE).send();

		req.body.value = req.body.value.toLowerCase();

		if(req.body.value != 'inherit' && req.body.value != 'grant' && req.body.value != 'deny') {
			return res.api.setError(config.errors.INVALID_PERMISSION_VALUE).send();
		}

		if(!req.info.params.pluginPath)
			req.info.params.pluginPath = null;

		if(req.body.value.toLowerCase() == 'inherit') {
			model.get('PermissionGroupPermission').destroy({
				where: {
					permissionGroupId: req.info.params.groupId,
					pluginPath: req.info.params.pluginPath,
					code: req.info.params.permissionCode
				}
			}).then(function(rootGroup) {
				model.get('PermissionGroup').flatten(req.info.params.groupId, function(err, permissionGroup) {
					res.api.setData(permissionGroup).send();
				});
			});
		}
		else {
			var targetVal = (req.body.value == 'grant') ? 1 : 0;
			model.get('PermissionGroupPermission').findOrCreate({
				where: {
					permissionGroupId: req.info.params.groupId,
					pluginPath: req.info.params.pluginPath,
					code: req.info.params.permissionCode,
					value: targetVal
				}
			}).then(function(permission) {
				if(!_.isArray(permission)) {
					return res.api.setError(config.errors.UNKNOWN_ERROR).send();
				}
				permission = permission[0];
				// @todo: do this in one query instead of two
				if(permission.value != targetVal) {
					permission.setDataValue('value', targetVal);
					permission.save().then(function() {
						model.get('PermissionGroup').flatten(req.info.params.groupId, function(err, permissionGroup) {
							res.api.setData(permissionGroup).send();
						});
					});
				}
				else {
					model.get('PermissionGroup').flatten(req.info.params.groupId, function(err, permissionGroup) {
						res.api.setData(permissionGroup).send();
					});
				}
			});
		}
	}
};