angular.module('myApp.navbar', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/navbar', {
    templateUrl: 'navbar.html',
    controller: 'NavbarCtrl'
  });
}])

.controller('NavbarCtrl', ["$scope", '$location', '$cookieStore', 'user', function($scope, $location, $cookieStore, user) {
	$scope.isActive = function(viewLocation) {
	     //    $(".nav").find(".active").removeClass("active");
   			// $(this).parent().addClass("active");

   			return viewLocation === $location.path();
	}
	$scope.username = ""
	var sessionCookie = $cookieStore.get('sessionToken')
	var usernameCookie = $cookieStore.get('username')
	$scope.verifySession = function() {
        if (sessionCookie) {
          user.sessionToken = sessionCookie
        	if (usernameCookie) {
        		 $scope.username = usernameCookie
        	}
        }
        else {
          $location.path("/login")
        }
     }
    $scope.verifySession()
}]);