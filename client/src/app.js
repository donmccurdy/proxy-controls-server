var angular = require('angular');

angular.module('proxyControlsApp', [
    require('angular-route'),
    require('angular-sanitize'),
    require('angular-touch')
  ])
  .constant('SERVER', {
    SOCKET_PATH: location.protocol + '//' + location.host + '/socketpeer/'
  });

require('./controllers');
require('./services');
