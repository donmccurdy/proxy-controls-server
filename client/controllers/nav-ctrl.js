module.exports = function ($scope, $document, $window, $element, $location) {
  
  // Navigation drawer state.
  $scope.navOpen = false;

  // Check if given path is active.
  $scope.isActive = function (path) { return path === $location.path(); };

  // Close navigation if page changes.
  $scope.$on('$locationChangeStart', function() {
    $window.scroll(0, 0);
    $scope.navOpen = false;
  });

  var closeNav = function (e) {
    if ($scope.navOpen) {
      $scope.$apply(function () { $scope.navOpen = false; });
      e.preventDefault();
    }
  };

  var isolateNav = function (e) { e.stopPropagation(); };

  // Close navigation if user clicks outside nav.
  $element.on('click', isolateNav);
  $element.on('touchstart', isolateNav);
  $document.on('touchstart', closeNav);
  $document.on('click', closeNav);

  $scope.$on('$destroy', function () {
    $document.off('touchstart', closeNav);
    $document.off('click', closeNav);
  });

};
