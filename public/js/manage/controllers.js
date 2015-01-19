angular.module('manage.controllers', ['manage.data', 'manage.services'])

.controller('SearchCtrl', function($scope, $rootScope, $state, $stateParams, SearchAPI) {
	$scope.searchResults = false;
	$scope.pages = [];
	$scope.pageInfo = false;
	$scope.loading = true;
	$scope.query = $stateParams.query;

	SearchAPI.get({
		query: $stateParams.query,
		page: $stateParams.page
	}).$promise.then(function(users) {
		$scope.loading = false;
		$scope.searchResults = users.data;
		$scope.pageInfo = users.metadata.page;
		var min = Math.max(users.metadata.page.current-5, 1);
		var max = Math.min(users.metadata.page.current+5, users.metadata.page.max);
		$scope.pages = [];
		for(var i=min; i<=max; i++) {
			$scope.pages.push({number: i, current: (i === users.metadata.page.current)});
		}
	});

	$scope.search = function(query) {
		$state.go('search', {query: query, page: 1});
	};

	$scope.editUser = function(userId) {
		$state.go('edit', {id: userId});
	};
})
.controller('EditCtrl', function($scope, $rootScope, $state, $stateParams) {
	$scope.loading = true;
});
