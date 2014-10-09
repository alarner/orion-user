module.exports = {
	attributes: {
		permissionGroupId: {
			model: 'PermissionGroup'
		},
		pluginPath: {
			type: 'string',
			required: true,
			defaultsTo: ''
		},
		code: {
			type: 'string',
			required: true
		},
		value: {
			type: 'boolean',
			required: true
		}
	}
};