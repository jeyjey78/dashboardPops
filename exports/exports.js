'use strict';

angular.module('myApp.exports', ['ngRoute'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/exports', {
    templateUrl: 'exports/exports.html',
    controller: 'ExportsCtrl'
  });
}])

.controller('ExportsCtrl', [function() {

}]);