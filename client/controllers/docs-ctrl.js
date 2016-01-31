module.exports = function ($scope, $location, $anchorScroll) {

	var originalOffset = $anchorScroll.yOffset;
	$anchorScroll.yOffset = 100;
	$anchorScroll();

  $scope.goHash = function (anchor) {
  	$location.hash(anchor);
  	$anchorScroll();
  };

  $scope.$on('$destroy', function () {
  	$anchorScroll.yOffset = originalOffset;
  });
};
