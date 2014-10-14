angular.module('permission', ['ui.router', 'permission.controllers', 'permission.services'])

.config(function($stateProvider) {
	$stateProvider

	.state('home', {
		url: '/home',
		templateUrl: 'templates/permission/home.html',
		controller: 'HomeCtrl'
	})

	.state('permission-group', {
		url: '/permission-group/:id',
		templateUrl: 'templates/permission/permission-group.html',
		controller: 'PermissionGroupCtrl'
	});

})

.run(function($state) {
	$state.go('home');
});

