module.exports = function ($scope, $window, RESOURCES) {
  $scope.demoUrl = RESOURCES.DEMO_URL;
  $scope.isMobile = $window.matchMedia('(max-width: 550px)').matches;

  $window.document.body.classList.add('bg-dark');
  $scope.$on('$destroy', function () {
		$window.document.body.classList.remove('bg-dark');  	
  });
};
