module.exports = function ($scope, $window, RESOURCES) {
  $scope.demoUrl = RESOURCES.DEMO_URL;
  $scope.isMobile = $window.matchMedia('(max-width: 550px)').matches;
};
