angular.module('myApp.navbar', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/navbar', {
    templateUrl: 'navbar.html',
    controller: 'NavbarCtrl'
  });
}])

.controller('NavbarCtrl', ["$scope", '$location', function($scope, $location) {
	console.log("MENU CLASSE")
$scope.isActive = function(route) {
        return route === $location.path();
    }

}]);