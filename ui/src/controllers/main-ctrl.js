module.exports = function ($scope, $timeout, ProxyService) {

  $scope.listeners = ProxyService.listeners;

  function update () {
    $timeout(function () {
      $scope.listeners = ProxyService.listeners;
    });
  }

  ProxyService.on('connect', update);
  ProxyService.on('upgrade', update);
  ProxyService.on('close', update);
};
