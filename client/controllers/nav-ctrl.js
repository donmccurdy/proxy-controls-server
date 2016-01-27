module.exports = function ($scope, $location) {
	$scope.isActive = function (path) {
		return path === $location.path();
	};
};
