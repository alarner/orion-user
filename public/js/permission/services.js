angular.module('permission.services', ['permission.data', 'ngResource'])
.factory('PermissionGroupAPI', function($resource, Host) {
	return $resource('http://'+Host+'/permission/group/:id', {id:'@id'});
});