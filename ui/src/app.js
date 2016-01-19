var angular = require('angular');

angular.module('proxyControlsApp', [
    require('angular-route'),
    require('angular-sanitize'),
    require('angular-touch')
  ])
  .constant('SERVER', {
    HOST: process.env.npm_package_config_host,
    PORT: process.env.npm_package_config_server_port
  });

require('./controllers');
require('./services');
