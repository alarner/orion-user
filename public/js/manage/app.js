angular.module('manage', ['ui.router', 'manage.controllers', 'manage.services'])

.config(function($stateProvider) {
	$stateProvider

	.state('search', {
		url: '/search',
		templateUrl: '/templates/manage/search.html',
		controller: 'SearchCtrl'
	});

	// .state('permission-group', {
	// 	url: '/permission-group/:id',
	// 	templateUrl: 'templates/permission/permission-group.html',
	// 	controller: 'PermissionGroupCtrl'
	// });

})

.run(function($state) {
	$state.go('search');
});

