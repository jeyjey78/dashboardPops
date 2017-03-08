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
	$scope.rights = user.rights
	$scope.scan = true
$scope.showCamera = false
	if ($scope.rights == "popscrew"){
		$scope.updateStatusDisable = false
	}
	else {
		 $scope.updateStatusDisable = true
	}

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
		if (!user.sessionToken) {
			return
		}

		$scope.loading = true
		if ($scope.orderId) {
			$scope.searchData = $scope.orderId
		}

		console.log($scope.searchData)
		$http({method: "GET", url: server.urlDev+'orders/'+$scope.searchData, headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
			console.log(response)

			if (response["data"]) {
				$scope.showOrder = true
				$scope.scan = true
				$scope.userId = response["data"]["userId"] != null ? response["data"]["userId"] : ""
        $scope.date = response["data"]["timestamps"]["created"] != null ? response["data"]["timestamps"]["created"] : ""
				$scope.status = response["data"]["orderStatus"] != null ? response["data"]["orderStatus"] : ""
				$scope.type = response["data"]["selections"][0]["productId"] != null ? response["data"]["selections"][0]["productId"] : ""
				$scope.priceFinal = response["data"]["priceFinal"] != null ? response["data"]["priceFinal"]+"€" : "-"
				$scope.priceShipping = response["data"]["priceShipping"] != null ? response["data"]["priceShipping"]+"€" : "-"
				$scope.priceProducts = response["data"]["priceProducts"] != null ? response["data"]["priceProducts"]+"€" : "-"
				$scope.credit = response["data"]["creditUsed"] != null ? "-"+response["data"]["creditUsed"]+"€" : "-"

				$scope.address = response["data"]["address"] != null ? response["data"]["address"] : ""
				$scope.sources = response["data"]["selections"][0]["sources"] != null ? response["data"]["selections"][0]["sources"] : ""
				$scope.newAddress = $scope.address

				var count = 0;
				$scope.sources.forEach(function(source) {
					count += source["quantity"]
				})
				$scope.nbPops = response["data"]["selections"][0]["productId"] != "libre" ? count + "/6" : count + "/15"


				$scope.statusSelected = $scope.statusOptions[$scope.getStatusIndex()]
				$scope.iconStatus = $scope.iconTable[$scope.status]
				if ($scope.rights == "popscrew") {
					$scope.getUser()
				}
				$scope.loading = false
			}
			else {
				$scope.loading = false
				$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
				alertView.error()
			}
		}, function errorCallback(response) {
			alert("ERROR")
		});
	}

	$scope.getUser = function(){
		$scope.loading = true
		$http({method: "POST", url: server.urlDev+'users/search',data: {"userId":$scope.userId},headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
			console.log(response)
			$scope.loading = false
			if (response["data"]) {
				$scope.username = response["data"]["username"] != null ? response["data"]["username"] : ""
				$scope.phone = response["data"]["phoneNumber"] != null ? response["data"]["phoneNumber"] : ""
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
		if (confirm("Do you really want to update the status of this order ?")) {
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
		else {
			$scope.statusSelected = $scope.statusOptions[$scope.getStatusIndex()]
		}
	}

	$scope.getStatusIndex = function() {
		for(var i=0; i<$scope.statusOptions.length; i++) {
        	if($scope.statusOptions[i]["status"] == $scope.status) {
             	return i
             }
        }
	}


	/*** QR CODE ***/
	$scope.showScanner = function() {
		$scope.showCamera = !$scope.showCamera
	}

	$scope.onSuccess = function(data) {
        console.log("Success : " + data);
				if ($scope.scan) {
					$scope.showCamera = false
					$scope.scan = false
					$scope.orderId = data
					$scope.searchOrder()
					// $location.path("/orders/"+data)
			}
    };
    $scope.onError = function(error) {
        console.log("ERORR : " +error);
    };


	/** INIT **/
	$scope.orderId = $routeParams.orderId;
	if ($scope.orderId) {
		console.log($scope.orderId)
		$scope.searchOrder()
	}
}]);

//ff3d7af34e34417482b2e7be25b3676bafc00b1b-3kg48q56z
