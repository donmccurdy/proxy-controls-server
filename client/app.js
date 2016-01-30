var angular = require('angular');

angular.module('proxyControlsApp', [
    require('angular-route'),
    require('angular-sanitize'),
    require('angular-touch')
  ])
  .constant('SERVER', {
    SOCKET_PATH: location.protocol + '//' + location.host + '/socketpeer/'
  })
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {templateUrl: 'views/home.html'})
      .when('/docs', {templateUrl: 'views/docs.html'})
      .when('/connect', {
        templateUrl: 'views/connect.html',
        controller: 'ConnectCtrl'
      })
      .otherwise({redirectTo: '/'});
  });

require('./controllers');
require('./services');
