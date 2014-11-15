module.exports = {
	options: {
		defaultController: 'IndexController',
		defaultAction: 'index'
	},
	routes: {
		'/permission/group/:groupId/:permissionCode': 'PermissionController.groupPermission',
		'/permission/group/:groupId/:pluginPath/:permissionCode': 'PermissionController.groupPermission',
		'get /fancy': 'CustomController.fancy',
		'post /fancy': 'CustomController.postFancy',
		'put /cstm/:id': 'CustomController.putWithId',
		'delete /whatwat/:face': 'DeleteController.whatwat',
		'/hello-world': 'HelloController.world',
		'/test/override': 'CustomController.override'
	}
};