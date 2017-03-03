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
  $scope.statusBatch = []
	$scope.statusOptions = [{
		status: "pending"
	},{
		status: "queued"
	},{
		status: "processing"
	},{
		status: "interlaced"
	},{
		status: "placed"
	},{
		status: "downloadable"
	},{
		status: "downloaded"
	}]

  $scope.newExportBtn = false
  $scope.exportDisable = true
  $scope.rights = user.rights

  /*** Utilities ***/
  $scope.getStatusIndex = function(status) {
		for(var i=0; i<$scope.statusOptions.length; i++) {
        	if($scope.statusOptions[i]["status"] == status) {
             	return i
             }
        }
	}

  /*** functions ***/
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
        $scope.statusSelected = $scope.statusOptions[0]
        if ($scope.statusSelected["status"] == "downloadable" || $scope.statusSelected["status"] == "downloaded") {
          $scope.exportDisable = false
        }
        else {
          $scope.exportDisable = true
        }
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

  $scope.cancelBatch = function (batchId) {
    console.log(batchId)
    if (confirm("Do you really want to cancel this batch?")) {
      $scope.loading = true
      $http({method: "POST", url: server.urlDev+'batches/'+batchId+"/cancel",headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
  			console.log(response)
  			$scope.loading = false
  			if (response["data"]) {
  				$scope.searchBatches()
  			}
  			else {
  				$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
  				alertView.error()
  			}
  		}, function errorCallback(response) {
  			alert("ERROR")
  		});
    }
  }

  $scope.searchBatches = function () {
    $scope.loading = true
    $http({method: "GET", url: server.urlDev+'batches/?batchStatus='+$scope.statusSelected["status"],headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
			console.log(response)
			$scope.loading = false
			if (response["data"]) {
				$scope.batches = response["data"] != null ? response["data"] : ""
        // console.log($scope.batches["batchStatus"])
        // console.log($scope.getStatusIndex($scope.batches["batchStatus"]))
        // $scope.batchStatus = $scope.statusOptions[$scope.getStatusIndex($scope.batches["batchStatus"])]
        if ($scope.statusSelected["status"] == "downloadable" || $scope.statusSelected["status"] == "downloaded") {
          $scope.exportDisable = false
        }
        else {
          $scope.exportDisable = true
        }
			}
			else {
				$(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
				alertView.error()
			}
		}, function errorCallback(response) {
			alert("ERROR")
		});
  }

  $scope.exportBatches = function(batchId) {
    $scope.loading = true
    $http({method: "GET", url: server.urlDev+'batches/'+batchId+"/zipUrl",headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
      console.log(response)
      $scope.loading = false
      if (response["data"]) {
        window.location.assign(response["data"]["zipUrl"])
      }
      else {
        $(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
        alertView.error()
      }
    }, function errorCallback() {
      alert("ERROR")
    });
  }

  $scope.updateStatusBatches = function(index, batchId) {
    if (confirm("Do you really want to update the status of this batch ?")) {
      $scope.loading = true
      var data = {"batchStatus":$scope.statusBatch[index]["status"]}
      $http({method: "POST", url: server.urlDev+'batches/'+batchId+"/status",data: data,headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
        console.log(response)
        $scope.loading = false
        if (response["data"]) {
          //$scope.batches = response["data"] != null ? response["data"] : ""
          $scope.searchBatches()
        }
        else {
          $(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
          alertView.error()
        }
      }, function errorCallback(response) {
        alert("ERROR")
      });
    }
    else {
      console.log($scope.statusOptions[$scope.getStatusIndex($scope.statusSelected["status"])])
      $scope.statusBatch[index] = $scope.statusOptions[$scope.getStatusIndex($scope.statusSelected["status"])]
    }
  }

}]);
