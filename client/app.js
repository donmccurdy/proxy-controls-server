var angular = require('angular');

angular.module('proxyControlsApp', [
	require('angular-route'),
	require('angular-sanitize'),
	require('angular-touch')
])
	.constant('RESOURCES', {
		DEMO_URL: '/demo',
		SOCKET_PATH: location.protocol + '//' + location.host + '/socketpeer/'
	})
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/home.html',
				controller: 'HomeCtrl'
			})
			.when('/docs', {
				templateUrl: 'views/docs.html',
				controller: 'DocsCtrl'
			})
			.when('/connect', {
				templateUrl: 'views/connect.html',
				controller: 'ConnectCtrl'
			})
			.otherwise({redirectTo: '/'});
	}).config(['$locationProvider', function ($locationProvider) {
		$locationProvider.hashPrefix('');
	}]);

require('./controllers');
require('./services');
