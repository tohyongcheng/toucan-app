// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
app = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'uiGmapgoogle-maps', 'ng-token-auth', 'ngStorage']);

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

    // var iosConfig = {
    //   "badge": true,
    //   "sound": true,
    //   "alert": true,
    // };

    // $cordovaPush.register(iosConfig).then(function(result) {
    //   // Success -- send deviceToken to server, and store for future use
    //   console.log("result: " + result)
    //   device_type = $cordovaDevice.getPlatform();
    //   device_token = result;
    //   // UserFactory.update_user_device(device_type, device_token);
    //   console.log("tried to update user device");
    // }, function(error) {
    //   // console.log("Registration error: " + err);
    //   $rootScope.validate_error(error);
    // });

    // $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
    
    //   console.log('notification: ', notification)
    //   if (notification.alert) {
    //     navigator.notification.alert(notification.alert);
    //     console.log('alert: ', notification.alert);
    //   }

    //   if (notification.sound) {
    //     var snd = new Media(event.sound);
    //     snd.play();
    //     console.log('sound: ', notification.sound);
    //   }

    //   if (notification.badge) {
    //     $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
    //       // Success!
    //       console.log('badge: ', notification.badge);
    //     }, function(error) {
    //       $rootScope.validate_error(error);
    //     });
    //   }
    // });

    $state.go('app.home');
  });
})

