'use strict';

angular.module('myApp.orders', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/orders', {
    templateUrl: 'orders/orders.html',
    controller: 'OrdersCtrl'
  });
}])

.controller('OrdersCtrl', [function() {
	$(function(){
		$("#loadnavbar").load("../navbar.html");
	});

}]);