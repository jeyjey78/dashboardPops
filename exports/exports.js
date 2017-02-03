'use strict';

angular.module('myApp.exports', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/exports', {
    templateUrl: 'exports/exports.html',
    controller: 'ExportsCtrl'
  });
}])

.controller('ExportsCtrl', [function() {
$(function(){
      $("#loadnavbar").load("../navbar.html"); 
    });
$(".nav a").on("click", function(){
   $(".nav").find(".active").removeClass("active");
   $(this).parent().addClass("active");
});
}]);