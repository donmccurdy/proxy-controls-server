var angular = require('angular');

angular.module('proxyControlsApp', [
    require('angular-route'),
    require('angular-sanitize'),
    require('angular-touch')
  ])
  .constant('SERVER', {
    HOST: process.env.PUBLIC_HOST,
    PORT: process.env.PUBLIC_PORT
  });

require('./controllers');
require('./services');
