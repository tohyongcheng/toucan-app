angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $auth, $state, $rootScope) {
  $scope.loginForm = {};

  $scope.login = function() {
    $auth.submitLogin($scope.loginForm)
      .then(function(resp) { 
        console.log(resp);
        $scope.loginForm = {};
        $state.go('app.home');
      })
      .catch(function(resp) { 
        console.log(resp);
      });
  };
})

.controller('LandingCtrl', function($scope, $auth, $state, $rootScope){
  $scope.login = function(){
    $state.go('login');
  }

  $scope.register = function(){
    $state.go('registration')
  }

})

.controller('RegistrationCtrl', function($scope, $auth, $state, $rootScope) {
  $scope.registrationForm = {};

  $scope.register = function() {
    $auth.submitRegistration($scope.registrationForm)
    .then(function(resp) { 
      console.log(resp);
      $scope.registrationForm = {};
      $state.go('app.createParent');
      // handle success response
      // how to send new response to server 
    })
    .catch(function(resp) { 
      alert("Error:", resp);
      // handle error response
    });
  };
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

.controller('CreateChildCtrl', function($scope, $auth, $state, $rootScope, $cordovaDatePicker, $ionicPlatform) {
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

  $ionicPlatform.ready(function() {
    
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    console.log("trying beforeEnter");
  });

  $scope.createchild = function(){
    $auth.updateAccount($scope.childForm).then(function(resp){
      console.log = (resp);
      $scope.childForm = {};
      $state.go('app.home');
    })

    .catch(function(resp) { 
      console.log(resp);
      // handle error response
    });
  };  


})

.controller('SetupAccountCtrl', function($scope, $auth, $state, $rootScope, $cordovaCamera, $ionicPlatform) {
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
    $scope.parentForm = {};
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


  $scope.createparent = function(){
    $auth.updateAccount($scope.parentForm)
      .then(function(resp){
        $state.go("app.createChild");
      })
    .catch(function(resp){
      console.log(resp);
    })
  }
})

.controller('HomeCtrl', function($scope, $http, $auth) {
  $scope.$on('$ionicView.beforeEnter', function() {
    
  });

  
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

  $http.get("http://toucan-api.herokuapp.com/device_api/v1/gps_messages/1234567890").
    success(function(data){
      LoadingService.hideLoading();
      $scope.locations = data;
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

    $http.post("http://toucan-api.herokuapp.com/mobile_api/ping_messages", data).then(function(success) {
      console.log(success);
    }, function(error){
      console.log(error);
    })
  }
})

.controller('ScanDeviceCtrl', function($scope,$auth,$cordovaBarcodeScanner, $ionicPlatform){
  $scope.$on('$ionicView.beforeEnter', function(){



  });

  $ionicPlatform.ready(function() {
    $scope.scan = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData){
        alert(barcodeData);
        $scope.qrstring = barcodeData;
      },function(error){

      });
    }
  });
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
    $http.get("http://toucan-api.herokuapp.com/mobile_api/audio_messages/?machine_uuid=1234567890").
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
    }
    src = recording.audio_message_url;
    $scope.currently_playing = new Media(src,
    function(success) {
      console.log('success', success); 
      $scope.currently_playing.play();
    },
    function(err) {
        console.log("recordAudio():Audio Error: "+ err.code);
    });
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
    var server = encodeURI("http://toucan-api.herokuapp.com/mobile_api/audio_messages");
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

