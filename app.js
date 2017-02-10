'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.login',
  'myApp.users',
  'myApp.orders',
  'myApp.exports',
  'myApp.navbar',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', '$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});

  //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
  //$httpProvider.defaults.useXDomain = true;
  //$httpProvider.defaults.withCredentials = true;

}])
.factory('user', function(){
  var user = {};

  user.sessionToken = "";
  user.username = "";
  user.password = "";
  user.userId = "";

  return user;
})

.factory('server', function(){
  var server = {};

  server.urlDev = "https://4i48oxh8hb.execute-api.us-east-1.amazonaws.com/dev/";

  return server;
})

.factory('alertView', function(){
	var alertView = {};
	alertView.success = function() {
		$(".alert-success").fadeTo(2000, 500).slideUp(500, function(){
		    $(".alert-success").slideUp(500);
		    $(".alert-success").remove()
		});
	}

	alertView.error = function() {
		$(".alert-danger").fadeTo(2000, 500).slideUp(500, function(){
		    $(".alert-danger").slideUp(500);
		    $(".alert-danger").remove()
		});

	}

	return alertView;
});
