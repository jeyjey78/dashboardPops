angular.module('myApp.navbar', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/navbar', {
    templateUrl: 'navbar.html',
    controller: 'NavbarCtrl'
  });
}])

.controller('NavbarCtrl', ["$scope", '$location', '$cookieStore', '$http', 'user', 'server', function($scope, $location, $cookieStore, $http, user, server) {
	$scope.isActive = function(viewLocation) {
	     //    $(".nav").find(".active").removeClass("active");
   			// $(this).parent().addClass("active");

   			return viewLocation === $location.path();
	}
	$scope.username = ""
  $scope.rights = ""
	var sessionCookie = $cookieStore.get('sessionToken')
	var usernameCookie = $cookieStore.get('username')
  var rights = $cookieStore.get('rights')
	$scope.verifySession = function() {
        if (sessionCookie) {
          user.sessionToken = sessionCookie
        	if (usernameCookie) {
        		 $scope.username = usernameCookie
             user.username = $scope.username
        	}
          if (rights) {
            $scope.rights = rights
            user.rights = $scope.rights
          }
        }
        else {
          $location.path("/login")
        }
     }
    $scope.verifySession()

    $scope.logOutAction = function() {
      $(document.body).css({'cursor' : 'wait'});
      $http({method: "POST", url: server.urlDev+'logout', headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
        $(document.body).css({'cursor' : 'default'});
        $location.path("/login")
        if (response["statusCode"]) {

        }
        else {
          $(".alertDivComment").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
          alertView.error()
        }
      }, function errorCallback(response) {
        alert("ERROR")
      });
    }
}]);
