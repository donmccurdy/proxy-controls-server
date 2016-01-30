var angular = require('angular');

var INTERVAL = 1000,
    DEFAULT_SCOPE = {
      pairCode: '',
      server: {connected: false},
      peer: {protocol: '', connected: false, latency: 0},
      listeners: [],
      protocolLabels: {
        rtc: 'WebRTC',
        socket: 'WebSocket'
      }
    };

module.exports = function ($scope, $route, $interval, ProxyService, RESOURCES) {
  var proxyService = null;

  $scope.demoUrl = RESOURCES.DEMO_URL;

  angular.merge($scope, angular.copy(DEFAULT_SCOPE));

  $scope.connect = function (pairCode) {
    if (proxyService) {
      throw new Error('Already connected to a client.');
    } else if (pairCode) {
      $scope.pairCode = pairCode;
      proxyService = ProxyService.get(pairCode);
    }
  };

  $scope.disconnect = function () {
    proxyService.destroy();
    proxyService = null;
    this.reset();
  }.bind(this);

  this.reset = function () {
    angular.merge($scope, angular.copy(DEFAULT_SCOPE));
  };

  // Poll for changes, because events emitted by proxy service and underlying
  // SocketPeer object aren't enough to indicate when server connection status
  // has changed.
  var intervalPromise = $interval(function () {
    if (!proxyService) return;
    $scope.server.connected = proxyService.isServerConnected();
    $scope.peer.protocol = proxyService.getPeerProtocol();
    $scope.peer.connected = proxyService.isPeerConnected();
    $scope.peer.latency = proxyService.getPeerLatency();
    $scope.listeners = proxyService.listeners;
  }, INTERVAL);

  $scope.$on('$destroy', function () {
    if (proxyService) $scope.disconnect();
    $interval.cancel(intervalPromise);
  });
};
