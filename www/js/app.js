// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
app = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'uiGmapgoogle-maps', 'ng-token-auth', 'ngStorage', 'angularMoment', 'angular-datepicker', 'angular-svg-round-progress']);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})

app.run(function($ionicPlatform, $rootScope, $state, $cordovaPush) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.$on('auth:login-error', function(ev, reason) {
      alert('auth failed because', reason.errors[0]);
    });

    $rootScope.$on('auth:validation_success', function(ev, reason) {
      console.log("validation success");
    });  

    $rootScope.childTypeImage = function(gender) {
        if (gender == "boy") return "img/BOY-01.png";
        else if (gender == "girl") return "img/GIRL-01.png";
        else return "img/BOY-01.png";
      }

      $rootScope.parentTypeImage = function(relationship) {
        if (relationship == "mother") return "img/MOM-01.png";
        else if (relationship == "father") return "img/DAD-01.png";
        else if (relationship == "grandmother") return "img/GRANDMA-01.png";
        else if (relationship == "grandfather") return "img/GRANDPA-01.png";
      }


    $state.go('app.home');
  });
})

