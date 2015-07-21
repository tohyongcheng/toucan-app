app.config(function($stateProvider, $urlRouterProvider, $authProvider, $ionicConfigProvider) {
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
  .state('createFirstChild', {
    url: "/create_first_child",
    templateUrl: "templates/create_first_child.html",
    controller: 'CreateChildCtrl'
  })
  .state('setupAccount', {
    url: "/setup_account",
    templateUrl: "templates/setupaccount.html",
    controller: 'SetupMyAccountCtrl'
  })
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl',
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      }
    }
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
  .state('app.createFamilyMember', {
    url: "/create_family_member",
    views: {
      'menuContent': {
        templateUrl: "templates/create_family_member.html",
        controller: 'CreateFamilyMemberCtrl'
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
  .state('app.voice_log', {
    url: "/record",
    views: {
      'menuContent': {
        templateUrl: "templates/voice_log.html",
        controller: 'VoiceLogCtrl'
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
  .state('app.scanDevice', {
    url:"/scandevice",
    views: {
      'menuContent': {
        templateUrl: "templates/scandevice.html",
        controller:'ScanDeviceCtrl'
      }
    }
  })
  .state('app.profile', {
    url:"/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller:'ProfileCtrl'
      }
    }
  })
  .state('app.family', {
    url:"/family",
    views: {
      'menuContent': {
        templateUrl: "templates/family.html",
        controller:'FamilyCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/landing');


  $authProvider.configure({
      apiUrl: 'http://localhost:3000',
      // apiUrl: 'http://128.199.103.102',
      storage: 'localStorage'
  });

  $ionicConfigProvider.backButton.previousTitleText(false);
});
