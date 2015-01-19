angular.module('manage.controllers', ['manage.data', 'manage.services'])

.controller('SearchCtrl', function($scope, $rootScope, $state) {

	$scope.search = function(query) {
		$scope.loading = true;
	}
});
