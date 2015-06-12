app.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $stateProvider
  .state('landing', {
    url:'/landing',
    templateUrl:"templates/landing.html",
    controller:"LandingCtrl"
  })
  .state('registration', {
    url:'/registration',
    templateUrl:"templates/sign_up.html",
    controller:"RegistrationCtrl"
  })
  .state('login', {
    url: '/login',
    templateUrl: "templates/login.html",
    controller: "LoginCtrl"
  })
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl',
    // resolve: {
    //   auth: function($auth) {
    //     return $auth.validateUser();
    //   }
    // }
  })
  .state('app.createChild', {
    url: "/create_child",
    views: {
      'menuContent': {
        templateUrl: "templates/create_child.html",
        controller: 'CreateChildCtrl'
      }
    }
  })
  .state('app.setupaccount', {
    url: "/setupaccount",
    views: {
      'menuContent': {
        templateUrl: "templates/setupaccount.html",
        controller: 'SetupAccountCtrl'
      }
    }
  })
  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.record', {
    url: "/record",
    views: {
      'menuContent': {
        templateUrl: "templates/record.html",
        controller: 'MediaCtrl'
      }
    }
  })
  .state('app.map', {
    url: "/map",
    views: {
      'menuContent': {
        templateUrl: "templates/map.html",
        controller: 'MapCtrl'
      }
    }
  })
  .state('app.ping', {
    url: "/ping",
    views: {
      'menuContent': {
        templateUrl: "templates/ping.html",
        controller: 'PingCtrl'
      }
    }
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  })
  .state('app.scandevice', {
    url:"/scandevice",
    views: {
      'menuContent': {
        templateUrl: "templates/scandevice.html",
        controller:'ScanDeviceCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/ping');


  $authProvider.configure({
      apiUrl: 'http://localhost:3000',
      storage: 'localStorage'
  });
});
