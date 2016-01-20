var INTERVAL = 1000;

module.exports = function ($scope, $interval, ProxyService) {
  $scope.server = {};
  $scope.listeners = [];
  $scope.protocolLabels = {
    rtc: 'WebRTC',
    socket: 'WebSocket'
  };

  // Poll for changes, because events emitted by proxy service and underlying
  // SocketPeer object aren't enough to indicate when server connection status
  // has changed.
  var intervalPromise = $interval(function () {
    $scope.server.connected = ProxyService.isServerConnected();
    $scope.server.protocol = ProxyService.getProtocol();
    $scope.listeners = ProxyService.listeners;
  }, INTERVAL);

  $scope.$on('$destroy', function () {
    $interval.cancel(intervalPromise);
  });
};
