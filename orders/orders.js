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
	$scope.showOrder = false
	$scope.address = []
	$scope.newAddress = []
	$scope.addressString = ""
	$scope.statusOptions = [{
		status: "pending", 
		icon: "time",
		selected: "false"
	},{
		status: "paid",
		icon: "credit-card",
		selected: "false"
	},{
		status: "processing",
		icon: "barcode",
		selected: "false"
	},{
		status: "printing",
		icon: "print",
		selected: "false"
	},{
		status: "sent",
		icon: "check",
		selected: "false"
	},{
		status: "pause",
		icon: "pause",
		selected: "false"
	},{
		status: "canceled",
		icon: "remove",
		selected: "false"
	},{
		status: "refunded",
		icon: "share-alt",
		selected: "false"
	},{
		status: "error",
		icon: "warning-sign",
		selected: "false"
	}]

	$scope.iconTable = {"pending": "time",
						"paid": "credit-card",
						"processing": "barcode",
						"printing": "print",
						"sent": "check",
						"pause": "pause",
						"canceled": "remove",
						"refunded": "share-alt",
						"error": "warning-sign",}

	$scope.iconStatus = ""

	$scope.searchOrder = function() {
		console.log("SEARCHING")
		$scope.loading = true
		if ($scope.orderId) {
			$scope.searchData = $scope.orderId
		}

		$http({method: "GET", url: server.urlDev+'orders/'+$scope.searchData, headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
			console.log(response)
			$scope.loading = false
			if (response["data"]) {
				$scope.showOrder = true
				$scope.status = response["data"]["orderStatus"] != null ? response["data"]["orderStatus"] : ""
				$scope.type = response["data"]["selections"][0]["productId"] != null ? response["data"]["selections"][0]["productId"] : ""
				$scope.priceFinal = response["data"]["priceFinal"] != null ? response["data"]["priceFinal"]+"€" : "-"
				$scope.priceShipping = response["data"]["priceShipping"] != null ? response["data"]["priceShipping"]+"€" : "-"
				$scope.priceProducts = response["data"]["priceProducts"] != null ? response["data"]["priceProducts"]+"€" : "-"
				$scope.credit = response["data"]["creditUsed"] != null ? "-"+response["data"]["creditUsed"]+"€" : "-"
				$scope.nbPops = response["data"]["selections"][0]["productId"] != "libre" ? response["data"]["selections"][0]["sources"].length + "/6" : response["data"]["selections"][0]["sources"].length + "/15"

				$scope.address = response["data"]["address"] != null ? response["data"]["address"] : ""
				$scope.newAddress = $scope.address

				$scope.statusSelected = $scope.statusOptions[$scope.getStatusIndex()]
				$scope.iconStatus = $scope.iconTable[$scope.status]

			}
			else {
				$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
				alertView.error()
			}
		}, function errorCallback(response) {
			alert("ERROR")
		});
	}

	$scope.updateAddress = function(){
		$scope.loading = true
		$http({method: "POST", url: server.urlDev+'orders/'+$scope.orderId+'/address',data: $scope.address,headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
			console.log(response)
			$scope.loading = false
			if (response["data"]) {

			}
			else {
				$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
				alertView.error()
			}
		}, function errorCallback(response) {
			alert("ERROR")
		});
	}

	$scope.updateStatus = function() {
		
		$scope.loading = true
		$http({method: "POST", url: server.urlDev+'orders/'+$scope.orderId+'/status',data: {"orderStatus":$scope.statusSelected["status"]},headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
			console.log(response)
			$scope.loading = false
			if (response["data"]) {
				$scope.iconStatus = $scope.iconTable[$scope.statusSelected["status"]]
				$scope.status = $scope.statusSelected["status"]
			}
			else {
				$scope.statusSelected = $scope.statusOptions[$scope.getStatusIndex()]
				$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
				alertView.error()
			}
		}, function errorCallback(response) {
			alert("ERROR")
		});
	}

	$scope.getStatusIndex = function() {
		for(var i=0; i<$scope.statusOptions.length; i++) {
			console.log($scope.statusOptions[i]["status"] + "  // " + $scope.status)
        	if($scope.statusOptions[i]["status"] == $scope.status) {
        		console.log("status : "+i)
             	return i
             }
        }
	}
	
	$scope.orderId = $routeParams.orderId;
	if ($scope.orderId) {
		console.log($scope.orderId)
		$scope.searchOrder()
	}
}]);

//ff3d7af34e34417482b2e7be25b3676bafc00b1b-3kg48q56z