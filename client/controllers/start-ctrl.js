var INTERVAL = 1000;

module.exports = function ($scope, $interval, ProxyService) {
  var proxyService = null;

  $scope.server = {};
  $scope.peer = {};
  $scope.listeners = [];
  $scope.protocolLabels = {
    rtc: 'WebRTC',
    socket: 'WebSocket'
  };

  $scope.connect = function (pairCode) {
    if (proxyService) {
      // TODO disconnect and create a new instance.
      throw new Error('Reconnect not yet supported');
    } else if (pairCode) {
      proxyService = ProxyService.get(pairCode);
    }
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
    $interval.cancel(intervalPromise);

    // TODO cancel connection if open
  });
};
