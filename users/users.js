'use strict';

angular.module('myApp.users', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl'
  });
}])

.controller('UsersCtrl', [function() {

	$(function(){
      $("#loadnavbar").load("../navbar.html"); 
    });

}]);