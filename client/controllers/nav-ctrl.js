module.exports = function ($scope, $document, $element, $location) {
	
	// Navigation drawer state.
	$scope.navOpen = false;

	// Check if given path is active.
	$scope.isActive = function (path) { return path === $location.path(); };

	// Close navigation if page changes.
	$scope.$on('$locationChangeStart', function() {
	  $scope.navOpen = false;
	});

	// Close navigation if user clicks outside nav.
	$element.on('click', function (e) { e.stopPropagation(); });
	$document.on('click', function () {
		$scope.$apply(function () { $scope.navOpen = false; });
	});

};
