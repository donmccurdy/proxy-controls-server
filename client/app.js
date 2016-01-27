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
      .when('/', {templateUrl: 'views/main.html'})
      .when('/docs', {templateUrl: 'views/docs.html'})
      .when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
      .otherwise({redirectTo: '/'});
  });

require('./controllers');
require('./services');
