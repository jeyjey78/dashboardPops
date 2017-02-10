'use strict';

angular.module('myApp.login', ['ngRoute', 'ngCookies'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ["$scope", '$location', '$http', '$cookieStore', 'user', 'alertView', 'server', function($scope, $location, $http, $cookieStore, user, alertView, server) {
	$scope.loading = false

	$scope.logInAction = function() {
		$scope.loading = true
		var data = {"username":$scope.username, "password":$scope.password}
		$http.post(server.urlDev+'login', data).success(function successCallback(response) {
		//$http({method:"POST", url: 'https://4i48oxh8hb.execute-api.us-east-1.amazonaws.com/dev/login', data: data, headers: {}}).then(function successCallback(response) {
    		console.log(response)
    		$scope.loading = false
    		if (response["data"]) {
	    		user.username = $scope.username
	    		user.password = $scope.password
	    		user.sessionToken = response["data"]["sessionToken"]
	    		$cookieStore.put('sessionToken',response["data"]["sessionToken"])
	    		$cookieStore.put('username',$scope.username)
		   		$location.path("/users")
	   		}
	   		else {
	   			$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
        		alertView.error()
	   		}
		}, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});

		
	}

}]);