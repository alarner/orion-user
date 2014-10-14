angular.module('permission.controllers', ['permission.data'])

.controller('HomeCtrl', function($scope, PermissionGroups) {
	console.log(PermissionGroups);
})

.controller('PermissionGroupCtrl', function($scope) {
	
});
