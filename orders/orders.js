'use strict';

angular.module('myApp.orders', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/orders', {
    templateUrl: 'orders/orders.html',
    controller: 'OrdersCtrl'
  }).when('/orders/:orderId', {
    templateUrl: 'orders/orders.html',
    controller: 'OrdersCtrl'
  });

}])

.controller('OrdersCtrl', ["$scope", '$routeParams', '$location', '$http', '$cookieStore', 'user', 'alertView', 'server', function($scope, $routeParams, $location, $http, $cookieStore, user, alertView, server) {
	$scope.loading = false

	$scope.searchOrder = function() {
    $scope.loading = true
    if ($scope.orderId) {
    	$scope.searchData = $scope.orderId
    }
    $http({method: "GET", url: server.urlDev+'orders/'+$scope.searchData, headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
        console.log(response)
        $scope.loading = false
        if (response["data"]) {
        	$scope.status = response["data"]["orderStatus"] != null ? response["data"]["orderStatus"] : ""
        	$scope.type = response["data"]["selections"][0]["productId"] != null ? response["data"]["selections"][0]["productId"] : ""
        	$scope.priceFinal = response["data"]["priceFinal"] != null ? response["data"]["priceFinal"] : ""
        }
        else {
          
          $(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
          alertView.error()
        }
    }, function errorCallback(response) {
      alert("ERROR")
    });
  }

	$scope.orderId = $routeParams.orderId;
	if ($scope.orderId) {
		console.log($scope.orderId)
		$scope.searchOrder($scope.orderId)
	}

	

}]);

//ff3d7af34e34417482b2e7be25b3676bafc00b1b-3kg48q56z