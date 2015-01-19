angular.module('manage.services', ['manage.data', 'ngResource'])
.factory('SearchAPI', function($resource, Host) {
	return $resource('http://'+Host+'/search');
});