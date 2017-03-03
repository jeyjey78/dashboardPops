'use strict';

angular.module('myApp.users', ['ngRoute','ngCookies'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl'
  });
}])

.controller('UsersCtrl', ["$scope", '$location', '$http', '$cookieStore', 'user', 'alertView', 'server', function($scope, $location, $http, $cookieStore, user, alertView, server) {

    $scope.loading = false
    $scope.comments = []
    $scope.livraison = false
    $scope.orders = []
    $scope.showUser = false

  $scope.searchUser = function() {
    $scope.loading = true

    console.log("token = "+ user.sessionToken)
    var isnum = /^\+?([0-9])+$/.test($scope.searchData);
    if (isnum == true) {
      var data = {"phoneNumber":$scope.searchData}
    }
    else {
      var data = {"username":$scope.searchData}
    }
    var header = {'sessionToken': user.sessionToken}
    console.log(header)
    console.log(server.urlDev+'users/search')
    $http({method: "POST", url: server.urlDev+'users/search', data: data ,headers: header}).success(function successCallback(response) {
        console.log(response)
        if (response["data"]) {
          $scope.showUser = true
          $scope.username = response["data"]["username"] != null ? response["data"]["username"] : ""
          $scope.phone = response["data"]["phoneNumber"] != null ? response["data"]["phoneNumber"] : ""
          $scope.userId = response["data"]["userId"] != null ? response["data"]["userId"] : ""
          $scope.credit = response["data"]["credit"] != null ? response["data"]["credit"]+"€" : "0.0€"

          $scope.loadComments()
          $scope.loadOrders()
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

  $scope.loadComments = function () {
    $http({method: "POST", url: server.urlDev+'users/'+$scope.userId+'/getNotes',headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
      console.log(response)
      if (response["data"]) {
        $scope.comments = response["data"]
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

  $scope.loadOrders = function() {
    $http({method: "GET", url: server.urlDev+'orders/user/'+$scope.userId,headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
      console.log(response)
      $scope.loading = false
      if (response["data"]) {
        $scope.orders = response["data"]

      }
      else {
        $(".alertDiv").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
        alertView.error()
      }
    }, function errorCallback(response) {
      alert("ERROR")
    });
  }

  $scope.getNbPops = function(index,sources) {
    var count = 0;
    sources.forEach(function(source) {
      count += source["quantity"]
    })
    return $scope.orders[index]["selections"][0]["productId"] != "libre" ? count + "/6" : count + "/15"
  }

  $scope.addComment = function() {
    $scope.loading = true
    if ($scope.commentText == '') {
      $(".alertDivComment").append("<div class='alert alert-danger'>champ vide...</div>")
      alertView.error()
      return
    }
    $http({method: "POST", url: server.urlDev+'users/'+$scope.userId+'/postNote', data: {"content":$scope.commentText}, headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
      console.log(response)
      $scope.loading = false
      if (response["data"]) {
        $scope.comments.splice(0,0,response["data"])
      }
      else {
        $(".alertDivComment").append("<div class='alert alert-danger'>"+response["errorMessage"]+"</div>")
        alertView.error()
      }
    }, function errorCallback(response) {
      alert("ERROR")
    });
  }

  $scope.addCredit = function() {
    $scope.loading = true
    if ($(".creditValue").val().length == 0) {
      return
    }

    var livraison = $scope.livraison == true ? 1 : 0

    $http({method: "POST", url: server.urlDev+'users/'+$scope.userId+'/addCredit', data: {"addedCredit":$scope.creditValue, "creditApplicableToShipping":livraison}, headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
      console.log(response)
      $scope.loading = false
      if (response["data"]) {
        $scope.credit = response["data"]["credit"] != null ? response["data"]["credit"]+"€" : "0.0€"
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
