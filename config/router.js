module.exports = {
	options: {
		defaultController: 'IndexController',
		defaultAction: 'index'
	},
	routes: {
		'/permission/group/:groupId/:permissionCode': 'PermissionController.groupPermission',
		'/permission/group/:groupId/:pluginPath/:permissionCode': 'PermissionController.groupPermission'
	}
};