angular.module('manage.services', ['manage.data', 'ngResource']);
// .factory('PermissionGroupAPI', function($resource, Host) {
// 	return $resource('http://'+Host+'/permission/group/:id', {id:'@id'});
// })
// .factory('PermissionGroupPermissionAPI', function($resource, Host) {
// 	return $resource(
// 		'http://'+Host+'/permission/group/:groupId/:pluginPath/:permissionCode',
// 		{
// 			groupId:'@groupId',
// 			pluginPath: '@pluginPath',
// 			permissionCode: '@permissionCode'
// 		},
// 		{
// 			'post': {method: 'POST'}
// 		}
// 	);
// });