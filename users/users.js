'use strict';

angular.module('myApp.users', ['ngRoute','ngCookies'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl'
  });
}])

.controller('UsersCtrl', ["$scope", '$location', '$http', '$cookieStore', 'user', 'alertView', 'server', function($scope, $location, $http, $cookieStore, user, alertView, server) {
     //var sessionCookie = $cookieStore.get('sessionToken')
    //  $scope.verifySession = function() {
    //     if (sessionCookie) {
    //       user.sessionToken = sessionCookie
    //     }
    //     else {
    //       $location.path("/login")
    //     }
    //  }
    // $scope.verifySession()

    // $(function(){
    //   $("#loadnavbar").load("../navbar.html");
    // });
    $scope.loading = false
    $scope.comments = []

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

    $http({method: "POST", url: server.urlDev+'users/search', data: data ,headers: {'sessionToken': user.sessionToken}}).success(function successCallback(response) {
        console.log(response)
        if (response["data"]) {
          $scope.username = response["data"]["username"] != null ? response["data"]["username"] : ""
          $scope.phone = response["data"]["phoneNumber"] != null ? response["data"]["phoneNumber"] : ""
          $scope.userId = response["data"]["userId"] != null ? response["data"]["userId"] : ""

          $scope.loadComments()
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

}]);

