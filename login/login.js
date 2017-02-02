'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ["$scope", '$location', function($scope, $location) {

	$scope.logInAction = function() {

		$location.path("/users")
	}
}]);