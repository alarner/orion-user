angular.module('manage', ['ui.router', 'manage.controllers', 'manage.services'])

.config(function($stateProvider) {
	$stateProvider

	.state('search', {
		url: '/search/:query/:page',
		templateUrl: '/templates/manage/search.html',
		controller: 'SearchCtrl'
	})

	.state('edit', {
		url: '/edit/:id',
		templateUrl: 'templates/manage/edit.html',
		controller: 'EditCtrl'
	});

})

.run(function($state) {
	$state.go('search');
});

