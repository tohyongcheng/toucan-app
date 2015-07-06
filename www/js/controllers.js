angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $auth, $state, $rootScope, $localStorage) {
  $scope.loginForm = {};

  $scope.login = function() {
    $auth.submitLogin($scope.loginForm)
      .then(function(resp) { 
        console.log(resp);
        $scope.loginForm = {};
        $localStorage.user_id = resp.id;
        $localStorage.email = resp.email;
        $state.go('app.home');
      })
      .catch(function(resp) { 
        console.log(resp);
      });
  };

  $scope.closeLogin = function() {
    $state.go('landing');
  }
})

.controller('LandingCtrl', function($scope, $auth, $state, $rootScope){
  $scope.login = function(){
    $state.go('login');
  }

  $scope.register = function(){
    $state.go('registration');
  }

})

.controller('RegistrationCtrl', function($scope, $auth, $state, $rootScope, $localStorage) {
  $scope.registrationForm = {};

  $scope.register = function() {
    $auth.submitRegistration($scope.registrationForm)
    .then(function(resp) { 
      console.log(resp);
      $scope.registrationForm = {};
      $localStorage.user_id = resp.id;
      $localStorage.email = resp.email;
      $state.go('setupAccount');
      // handle success response
      // how to send new response to server 
    })
    .catch(function(resp) { 
      alert("Error:", resp);
      // handle error response
    });
  };

  $scope.goBack = function() {
    $state.go('landing');
  }
})


.controller('SettingsCtrl', function($scope, $auth, $state, $rootScope) {
  $scope.settings = {};
  $scope.$on('$ionicView.beforeEnter', function() {
    
  });
})

.controller('UpdatePasswordCtrl', function($scope, $auth, $state, $rootScope) {
  $scope.passwordForm = {};
  $scope.$on('$ionicView.beforeEnter', function() {
    
  });
})

.controller('CreateChildCtrl', function($scope, $auth, $state, $rootScope, $cordovaDatePicker, $ionicPlatform, $http, $cordovaBarcodeScanner) {
  $ionicPlatform.ready(function() {
    $scope.scan = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData){
        console.log(barcodeData);
        $scope.childForm.machine_uuid = barcodeData;
      },function(error){

      });
    }
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.showChildParticulars = true;
  });

  $scope.childForm = {};
  var options = {
    date: new Date(),
    mode: 'date', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };
  
  $scope.show_datepicker = function() {
    $cordovaDatePicker.show(options).then(function(date){
        alert(date);
    });
  }

  $scope.create_child = function(){
    $http.post("http://localhost:3000/mobile_api/children", $scope.childForm).success(function(data){
      $state.go("app.home");
      console.log(data);
    }).error(function(data) {
      console.log(data);
    });
  };  

  $scope.nextStep = function() {
    console.log("next step");
    $scope.showChildParticulars = false;
  }

  $scope.goBack = function() {
    console.log("go back");
    $scope.showChildParticulars = true;
  }
})

.controller('CreateFirstChildCtrl', function($scope, $auth, $state, $rootScope, $cordovaDatePicker, $ionicPlatform, $http) {
  $ionicPlatform.ready(function() {
    
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    console.log("trying beforeEnter");
  });

  $scope.childForm = {};
  var options = {
    date: new Date(),
    mode: 'date', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };
  
  $scope.show_datepicker = function() {
    $cordovaDatePicker.show(options).then(function(date){
        alert(date);
    });
  }

  $scope.create_child = function(){
    $http.post("http://localhost:3000/mobile_api/children", $scope.childForm).success(function(data,status,headers,config){
      console.log(data);
      $state.go('app.home');
    }).error(function(data,status,headers,config) {
      console.log(data);
    });
  };  
})

.controller('SetupMyAccountCtrl', function($scope, $auth, $state, $rootScope, $cordovaCamera, $ionicPlatform) {
  var options = {
    quality: 50,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.CAMERA,
    allowEdit: false,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 100,
    targetHeight: 100,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false
  };
  $scope.parentForm = {};
  $scope.$on('$ionicView.beforeEnter', function() {
    
  }); 

  $ionicPlatform.ready(function() {
    $scope.takephoto = function() {
      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
      }, function(err) {
      alert("error");
      // error
      });
    }
  });


  $scope.updateParentParticulars = function(){
    $auth.updateAccount($scope.parentForm)
      .then(function(resp){
        $state.go("createFirstChild");
      })
    .catch(function(resp){
      console.log(resp);
    })
  }
})

.controller('HomeCtrl', function($scope, $http, $auth, $localStorage, $ionicSlideBoxDelegate, $state) {
  $scope.$on('$ionicView.beforeEnter', function() {
    // Get Children
    $http.get("http://localhost:3000/mobile_api/users/"+$localStorage.user_id).
    success(function(data) {
      $scope.children = data.children;
      console.log("get user data", data);
      $ionicSlideBoxDelegate.update();
      if (data.children.length == 0) {
        console.log("Going to Account Setup");
        $state.go("app.createChild");
      }
    }).
    error(function(data) {

    });

    // Get Notifications
    $http.get("http://localhost:3000/mobile_api/user_notifications/").
    success(function(data) {
      $scope.notifications = data;
      console.log("get user notifications", data);
    }).
    error(function(data) {

    });
  }); 

  
})

.controller('CreateFamilyMemberCtrl', function($scope, $http, $auth, $localStorage) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.parentForm = {};
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      
    }); 

    $ionicPlatform.ready(function() {
      $scope.takephoto = function() {
        $cordovaCamera.getPicture(options).then(function(imageData) {
          var image = document.getElementById('myImage');
          image.src = "data:image/jpeg;base64," + imageData;
        }, function(err) {
        alert("error");
        // error
        });
      }
    });
  });

  $scope.createFamilyMember = function() {
    $scope.parentForm = {};
  }

  
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $cordovaPush, $auth, $state) {
  // Create the login modal that we will use later
  $scope.logout = function() {
    $auth.signOut()
    .then(function(resp) { 
      console.log("successfully logged out", resp);
      $state.go('login');
    })
    .catch(function(resp) { 
      console.log("error in logging out", resp);// handle error response
    });
  }
})

.controller('MapCtrl', function($scope, uiGmapGoogleMapApi, $http, LoadingService) {
  LoadingService.showLoading();
  $scope.locations = [];

  $http.get("http://localhost:3000/mobile_api/gps_messages/1?machine_uuid=1234567890").
    success(function(data){
      LoadingService.hideLoading();
      $scope.locations = data;
      if ($scope.locations.length > 0) {
        $scope.map = { center: { latitude: $scope.locations[data.length-1].lat, longitude: $scope.locations[data.length-1].lng }, zoom: 13 };
        $scope.marker = {
          id: 0,
          coords: {
            latitude: $scope.locations[data.length-1].lat,
            longitude: $scope.locations[data.length-1].lng
          },
          options: { draggable: false },
          events: {}
        };  
      } else {
        $scope.map = { center: { latitude: 1.3000, longitude: 103.8 }, zoom: 11 };
        $scope.marker = {
          id: 0,
          coords: {
            latitude: 1.3000,
            longitude: 103.8
          },
          options: { draggable: false },
          events: {}
        };  
      }
      
    }).error(function(data) {
      console.log("Error: ", data);
    });
})

.controller('PingCtrl', function($scope, $http) {
  $scope.$on('$ionicView.beforeEnter', function() {
    
  });

  $scope.ping =function() {
    data = {
      ping_message : { user_id: 1, color: 0 },
      machine_uuid: 1234567890
    };

    $http.post("http://localhost:3000/mobile_api/ping_messages", data).then(function(success) {
      console.log(success);
    }, function(error){
      console.log(error);
    })
  }
})

.controller('MediaCtrl',function($scope, $stateParams, $ionicPlatform, $cordovaFile, $cordovaMedia, $cordovaCapture, $cordovaFileTransfer, $timeout, LoadingService, $http) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.audio_file = null;
    $scope.audio_file_entry = null;
    $scope.audio_recordings = [];
    $scope.currently_playing = null;
    console.log($cordovaMedia);
    console.log($cordovaCapture);
    console.log($cordovaFile);
    console.log($cordovaFileTransfer);
    console.log("READY");

    LoadingService.showLoading();
    $http.get("http://localhost:3000/mobile_api/audio_messages/?machine_uuid=1234567890").
    success(function(data){
      LoadingService.hideLoading();
      $scope.audio_recordings = data;
      $scope.audio_recordings.reverse();
    }).error(function(data) {
      console.log("Error: ", data);
    });
  });

  $scope.play_recording = function(recording) {
    console.log(recording);
    if ($scope.currently_playing != null) {
      $scope.currently_playing.stop();
      $scope.currently_playing.release();  
      $scope.currently_playing = null;
    }
    src = recording.audio_message_url;
    console.log("src", src);
    $scope.currently_playing = new Media(src,
    function(success) {
      console.log('success', success); 
    },
    function(err) {
        console.log("recordAudio():Audio Error: "+ err.code);
    });
    $scope.currently_playing.play();
  }

  $scope.start_record = function() {
    // $scope.audio_file.startRecord();
    if (ionic.Platform.isIOS()) {
      src = "documents://myrecording.m4a";
      $scope.audio_file = new Media(src,
      function(success) {
        console.log('success', success); 
      },
      function(err) {
          console.log("recordAudio():Audio Error: "+ err.code);
      });
      
    }

    if (ionic.Platform.isAndroid()) {
      var src = "documents://myrecording.amr"; 
      $scope.audio_file = new Media(src,
      function() {
          console.log("recordAudio():Audio Success");
      },
      function(err) {
          console.log("recordAudio():Audio Error: "+ err.code);
      });
    }
    
    // Record audio
    $scope.audio_file.startRecord();
  }

  $scope.stop_record = function() {
    $scope.audio_file.stopRecord();
    if (ionic.Platform.isIOS()) { 
      $cordovaFile.checkFile(cordova.file.documentsDirectory, "myrecording.m4a").then(function(success) {
        $scope.audio_file_entry = success;
      });
    }

    if (ionic.Platform.isAndroid()) { 
      
    }
    console.log("The audio is " +  $scope.audio_file.getDuration() + "seconds long.");
  }

  $scope.play = function() {
    $scope.audio_file.play();
  }

  $scope.stop = function() {
    $scope.audio_file.stop();
  }

  $scope.release = function() {
    $scope.audio_file.release();
  }

  $scope.upload_record = function() {
    console.log("uploading");
    var options = {chunkedMode: false, fileKey: "file", fileName: "recording.m4a", mimeType: "audio/m4a", httpMethod: "POST"};
    options.params = { machine_uuid: 1234567890 }
    var server = encodeURI("http://localhost:3000/mobile_api/audio_messages");
    var filePath = $scope.audio_file_entry.nativeURL;
    console.log('filePath', filePath);

    $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
      console.log(result);
    }, function(err) {
      console.log(err);
    }, function (progress) {
      // constant progress updates
    });
  }

  $scope.captureAudio = function() {
    var options = { limit: 3, duration: 10 };

    $cordovaCapture.captureAudio(options).then(function(audioData) {
      // Success! Audio data is here
      var i, path, len;
      for (i = 0, len = audioData.length; i < len; i += 1) {
          path = audioData[i].fullPath;
          console.log(path);
          $scope.audio_file = $cordovaMedia.newMedia(path);
          // do something interesting with the file
      }
    }, function(err) {
      // An error occurred. Show a message to the user
    });
  }

});

