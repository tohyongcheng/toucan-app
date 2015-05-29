angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MapCtrl', function($scope, uiGmapGoogleMapApi, $http) {
  uiGmapGoogleMapApi.then(function(maps) {
    console.log("uiGmapGoogleMapApi loaded");
  });
  $scope.locations = [];

  $http.get("http://toucan-api.herokuapp.com/device_api/v1/gps_messages/1234567890").
    success(function(data){
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
      console.log($scope.marker);
      $scope.$apply();
      console.log($scope.locations);
    }).error(function(data) {
      console.log("Error: ", data);
    });
})

.controller('MediaCtrl',function($scope, $stateParams, $ionicPlatform, $cordovaFile, $cordovaMedia, $cordovaCapture, $cordovaFileTransfer, $timeout, $log ) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.audio_file = null;
    $scope.audio_file_entry = null;
    console.log($cordovaMedia);
    console.log($cordovaCapture);
    console.log($cordovaFile);
    console.log($cordovaFileTransfer);
    console.log("READY");
  });

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

