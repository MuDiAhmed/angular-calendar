'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ui.router'
]);
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('/', {
          url:'/',
          abstract: true,
          templateUrl: 'partials/main.html',
          controller: 'MainController'
        })
        .state('calender', {
          url:'',
          parent:'/',
          templateUrl: 'partials/calender.html',
          controller: 'CalenderController'
        });
    $urlRouterProvider.otherwise('/');
  }
]);
