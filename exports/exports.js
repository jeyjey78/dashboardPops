'use strict';

angular.module('myApp.exports', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/exports', {
    templateUrl: 'exports/exports.html',
    controller: 'ExportsCtrl'
  });
}])

.controller('ExportsCtrl', ["$scope", '$routeParams', '$location', '$http', '$cookieStore', 'user', 'alertView', 'server', function($scope, $routeParams, $location, $http, $cookieStore, user, alertView, server) {
	$scope.batches = []
	$scope.statusOptions = [{
		status: "pending",
		icon: "time",
		selected: "false"
	}]
  $scope.newExportBtn = false
  $scope.rights = user.rights

	$scope.getWaitingOrders = function(){
		$scope.loading = true
    console.log("TOKEN"+user.sessionToken);
		$http({method: "GET", url: server.urlDev+'orders/numberwaiting',headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
			console.log(response)
			//$scope.loading = false
			if (response["data"]) {
				$scope.numberWaiting = response["data"]["count"] != null ? response["data"]["count"] : ""

        if ($scope.numberWaiting == 0) {
          $scope.newExportBtn = true
        }
        else {
          $scope.newExportBtn = false
        }

				$scope.getBatches()
			}
			else {
				$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
				alertView.error()
			}
		}, function errorCallback(response) {
			alert("ERROR")
		});
	}

	$scope.getBatches = function() {
		$http({method: "GET", url: server.urlDev+'batches',headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
			console.log(response)
			$scope.loading = false
			if (response["data"]) {
				$scope.batches = response["data"] != null ? response["data"] : ""
			}
			else {
				$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
				alertView.error()
			}
		}, function errorCallback(response) {
			alert("ERROR")
		});
	}

	$scope.newExport = function() {
    $scope.loading = true
		var data = {"batchInput": {"sheets": $scope.nbPaper, "pitch": $scope.pitchValue}}
		//console.log(data)
		//return
		$http({method: "POST", url: server.urlDev+'batches',data: data,headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
			console.log(response)
			$scope.loading = false
			if (response["data"]) {
        $scope.getBatches()
				//$scope.numberWaiting = response["data"]["count"] != null ? response["data"]["count"] : ""
			}
			else {
				$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
				alertView.error()
			}
		}, function errorCallback(response) {
			alert("ERROR")
		});
	}
}]);
