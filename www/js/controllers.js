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
  $scope.registrationForm.photo = null;

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

.controller('CreateChildCtrl', function($scope, $auth, $state, $rootScope, $cordovaDatePicker, $ionicPlatform, $http, $cordovaBarcodeScanner, $cordovaCamera, LoadingService) {
  
  // Setup BeforeEnter
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.showChildParticulars = true;
    $scope.childForm = {};
  });

  // Setup Barcode Scanner Function
  $ionicPlatform.ready(function() {
    $scope.scan = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData){
        console.log(barcodeData);
        $scope.childForm.machine_uuid = barcodeData.text;
      },function(error){
        alert("There was an error processing the barcode. Please try again!");
      });
    }
  });

  // Setup Camera Functions
  document.addEventListener("deviceready", function () {
    $scope.launch_camera = function() {
      LoadingService.showLoading();
      var camera_options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(camera_options).then(function(imageData) {
        var image = document.getElementById('myImage');
        $scope.childForm.photo = "data:image/jpeg;base64," + imageData;
        LoadingService.hideLoading();
      }, function(error) {
      
      });
    }


    $scope.launch_photo_library = function() {
      LoadingService.showLoading();
      var photo_library_options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        mediaType: Camera.MediaType.PICTURE
      };

      $cordovaCamera.getPicture(photo_library_options).then(function(imageData) {
        // console.log(imageData);
        $scope.childForm.photo = "data:image/jpeg;base64," + imageData;
        LoadingService.hideLoading();
        //console.log(image.src);
      }, function(error) {
        LoadingService.hideLoading();
      });
    }

    $scope.show_datepicker = function() {
      var options = {
          date: new Date(),
          mode: 'date'
      };
      $cordovaDatePicker.show(options).then(function(date){
          $scope.childForm.birthday = date;
      });
    }
  }, false);



  $scope.create_child = function(){
    $http.post($auth.apiUrl() + "/mobile_api/children", $scope.childForm).success(function(data){
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

  $scope.validate_first_step = function() {
    if (($scope.childForm.name == null) || ($scope.childForm.name == "")) return true;
    if (($scope.childForm.birthday == null) || ($scope.childForm.birthday == "")) return true;
    if (($scope.childForm.mobile_number == null) || ($scope.childForm.birthday == "")) return true;
    return false;
  }

  $scope.validate_form = function() {
    if ($scope.childForm.machine_uuid == null) return true;
    return false;
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
    $http.post($auth.apiUrl() + "/mobile_api/children", $scope.childForm).success(function(data,status,headers,config){
      console.log(data);
      $state.go('app.home');
    }).error(function(data,status,headers,config) {
      console.log(data);
    });
  };  
})

.controller('SetupMyAccountCtrl', function($scope, $auth, $state, $rootScope, $cordovaCamera, $ionicPlatform, LoadingService) {

  $scope.parentForm = {};
  $scope.$on('$ionicView.beforeEnter', function() {
    
  }); 

  document.addEventListener("deviceready", function () {
    $scope.launch_camera = function() {
      LoadingService.showLoading();
      var camera_options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(camera_options).then(function(imageData) {
        var image = document.getElementById('myImage');
        $scope.parentForm.photo = "data:image/jpeg;base64," + imageData;
        LoadingService.hideLoading();
      }, function(error) {
      
      });
    }


    $scope.launch_photo_library = function() {
      LoadingService.showLoading();
      var photo_library_options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        mediaType: Camera.MediaType.PICTURE
      };

      $cordovaCamera.getPicture(photo_library_options).then(function(imageData) {
        // console.log(imageData);
        $scope.parentForm.photo = "data:image/jpeg;base64," + imageData;
        LoadingService.hideLoading();
        //console.log(image.src);
      }, function(error) {
        LoadingService.hideLoading();
      });
    }
  }, false);


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

.controller('HomeCtrl', function($scope, $http, $auth, $localStorage, $ionicSlideBoxDelegate, $state, GlobalFactory) {
  $scope.$on('$ionicView.beforeEnter', function() {
    // Get Children
    $http.get($auth.apiUrl() + "/mobile_api/users/"+$localStorage.user_id).
    success(function(data) {
      console.log(data.children);
      $scope.children = data.children;
      GlobalFactory._set_my_children(data.children);
      console.log($localStorage.children_id);
      console.log("get user data", data);
      
      if (data.children.length == 0) {
        alert("Please create a child!");
      } else {
        $scope.notifications = $scope.children[0].latest_notifications;
        $ionicSlideBoxDelegate.update();
      }

    }).
    error(function(data) {
      console.log("error", data);
    });   

    $http.get($auth.apiUrl() + "/mobile_api/users/").
    success(function(data) { 
      console.log("family", data);
      GlobalFactory._set_my_family(data);
    }).
    error(function(data){
      console.log("error getting family");
    });
  }); 

  $scope.slideHasChanged = function(idx) {
    if (idx < $scope.children.length) {
      $scope.notifications = $scope.children[idx].latest_notifications;
    } else {
      $scope.notifications = [];
    }
  }

  $scope.notificationClassType = function(notification_type) {
    if (notification_type == "location") return "ion-location";
    if (notification_type == "audio") return "ion-mic-a";
    if (notification_type == "ping") return "ion-radio-waves";
    if (notification_type == "battery") return "ion-battery-low";

    return "";
  }
})

.controller('CreateFamilyMemberCtrl', function($scope, $http, $auth, $localStorage, $ionicPlatform, $cordovaCamera, LoadingService) {
  $scope.parentForm = {};
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.parentForm.photo = null;
  }); 

  document.addEventListener("deviceready", function () {
    $scope.launch_camera = function() {
      LoadingService.showLoading();
      var camera_options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(camera_options).then(function(imageData) {
        var image = document.getElementById('myImage');
        $scope.parentForm.photo = "data:image/jpeg;base64," + imageData;
        LoadingService.hideLoading();
      }, function(error) {
      
      });
    }


    $scope.launch_photo_library = function() {
      LoadingService.showLoading();
      var photo_library_options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        mediaType: Camera.MediaType.PICTURE
      };

      $cordovaCamera.getPicture(photo_library_options).then(function(imageData) {
        // console.log(imageData);
        $scope.parentForm.photo = "data:image/jpeg;base64," + imageData;
        LoadingService.hideLoading();
        //console.log(image.src);
      }, function(error) {
        LoadingService.hideLoading();
      });
    }
  }, false);

  $scope.createFamilyMember = function() {
    $http.post($auth.apiUrl() + "/mobile_api/users", $scope.parentForm)
    .success(function(data) {
      alert("Family Member created!");
      $scope.parentForm = {};
      $scope.parentForm.photo = null;
    }).
    error(function(error) {
      console.log(error);
    });
    
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $cordovaPush, $auth, $state) {
  // Create the login modal that we will use later
  $scope.logout = function() {
    $auth.signOut()
    .then(function(resp) { 
      console.log("successfully logged out", resp);
      $state.go('landing');
    })
    .catch(function(resp) { 
      console.log("error in logging out", resp);// handle error response
      $state.go('landing');
    });
  }
})

.controller('MapCtrl', function($scope, $auth, uiGmapGoogleMapApi, $http, LoadingService, GlobalFactory) {
  LoadingService.showLoading();
  $scope.locations = {};
  $scope.children = GlobalFactory._get_my_children();
  $scope.max_timestep_length = 0;
  $scope.timestep = 0;
  $scope.markers = [];

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.confirmed = 0;
  });

  $http.get($auth.apiUrl() + "/mobile_api/gps_messages").
  success(function(data){      
    $scope.locations = data;
    $scope.initMap();
  }).error(function(data) {
    console.log("Error: ", data);
  });

  $scope.initMap = function() {
    if (($scope.children.length > 0) && (Object.keys($scope.locations).length > 0))  {
      $scope.map = { center: { latitude: 1.3000, longitude: 103.8 }, zoom: 12 };
      console.log($scope.map);
      $scope.markers = [];
      for (key in $scope.locations) {
        console.log(key, $scope.locations[key]);
        var len = $scope.locations[key].length;
        $scope.max_timestep_length = Math.max(len, $scope.max_timestep_length);
        if (len > 0) {
          $scope.markers.push({
            id: key,
            coords: {
              latitude: $scope.locations[key][len-1].lat,
              longitude: $scope.locations[key][len-1].lng
            }
          });          
        } else {
          $scope.markers.push({
            id: key
          }); 
        }
      }
      LoadingService.hideLoading();
    } else {
      $scope.map = { center: { latitude: 1.3000, longitude: 103.8 }, zoom: 11 };
    }
  }

  $scope.changeTimeStep = function(timestep) {
    var i = 0;
    for (key in $scope.locations) {
      $scope.markers[i] = {
        id: key,
        coords: {
          latitude: $scope.locations[key][timestep].lat,
          longitude: $scope.locations[key][timestep].lng
        }
      };
      i++;
    }
  }
  
})

.controller('PingCtrl', function($scope, $http, $ionicModal, $ionicPopup, $auth, GlobalFactory) {
  
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.selected_children = {};
    $scope.selected_color = 0;
    $scope.show_colours = false;
    $scope.children = GlobalFactory._get_my_children();
  });

  $scope.toggle_child = function(child) {
    console.log("toggle child");
    if ($scope.selected_children[child.id]) {
      delete $scope.selected_children[child.id];
    } else {
      $scope.selected_children[child.id] = child;
    }
    if (Object.keys($scope.selected_children).length > 0) $scope.show_colours = true;
    else $scope.show_colours = false;

    console.log($scope.selected_children);
    console.log($scope.show_colours);
  }

  $scope.is_selected = function(child) {
    if (child.id in $scope.selected_children) return "child-selected";
    else return "child-not-selected";
  }

  $scope.ping = function(color) {
    angular.forEach($scope.selected_children, function(value, key) {
      console.log(value, key);
      var data = {
        ping_message : { color: color, child_id: parseInt(key) }
      };

      $http.post($auth.apiUrl() + "/mobile_api/ping_messages", data).then(function(success) {
        console.log(success);
        alert("Ping sent successfully!");
      }, function(error){
        console.log(error);
      });
    })
  }
})

.controller('MediaCtrl',function($scope, $stateParams, $ionicPlatform, $cordovaFile, $cordovaMedia, $cordovaCapture, $cordovaFileTransfer, $timeout, LoadingService, $http, GlobalFactory, $auth, SMSService) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.audio_file = null;
    $scope.audio_file_entry = null;
    $scope.audio_recordings = [];
    $scope.currently_playing = null;
    
    $scope.selected_children = {};
    $scope.children = GlobalFactory._get_my_children();
    $scope.ft = new FileTransfer();

    LoadingService.showLoading();
    $http.get($auth.apiUrl() + "/mobile_api/audio_messages/?machine_uuid=1234567890").
    success(function(data){
      LoadingService.hideLoading();
      $scope.audio_recordings = data;
      $scope.audio_recordings.reverse();
    }).error(function(data) {
      console.log("Error: ", data);
    });
  });

  $scope.toggle_child = function(child) {
    console.log("toggle child");
    if ($scope.selected_children[child.id]) {
      delete $scope.selected_children[child.id];
    } else {
      $scope.selected_children[child.id] = child;
    }
    if (Object.keys($scope.selected_children).length > 0) $scope.show_colours = true;
    else $scope.show_colours = false;

    console.log($scope.selected_children);
    console.log($scope.show_colours);
  }

  $scope.is_selected = function(child) {
    if (child.id in $scope.selected_children) return "child-selected";
    else return "child-not-selected";
  }

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
    var options = {chunkedMode: false, fileKey: "file", fileName: "recording.m4a", mimeType: "audio/m4a", httpMethod: "POST", test: "asdfasdf",
                    headers: $auth.retrieveData('auth_headers'), params: {}
                  };
    var children_id = [];
    for (key in $scope.selected_children) {
      children_id.push(key);
    }
    console.log("children id",children_id);
    options.params = { "child_id": children_id.join() };
    var server = encodeURI($auth.apiUrl() + "/mobile_api/audio_messages");
    var filePath = $scope.audio_file_entry.nativeURL;
    console.log('filePath', filePath);
    console.log("child id params",options.params.child_id);


    var win = function (result) {
      for (key in $scope.selected_children) {
        SMSService.sendSMS($scope.selected_children[key].mobile_number, "Audio");
        console.log("sending SMS from MediaCtrl");
      }
    }

    var fail = function(err) {

    }

    $scope.ft.upload(filePath, server, win, fail, options);
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
})
.controller('VoiceLogCtrl',function($scope, $stateParams, $ionicPlatform, $cordovaFile, $cordovaMedia, $cordovaCapture, $cordovaFileTransfer, $timeout, LoadingService, $http, $auth) {
  $scope.$on('$ionicView.beforeEnter', function() {
    
    LoadingService.showLoading();
    $http.get($auth.apiUrl() + "/mobile_api/audio_messages/?machine_uuid=1234567890").
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
})
.controller('ProfileCtrl',function($scope, $stateParams, $cordovaCamera, $timeout, LoadingService, $http, $auth) {

  $scope.$on('$ionicView.beforeEnter', function() {
  });

  document.addEventListener("deviceready", function () {
    $scope.launch_camera = function() {
      LoadingService.showLoading();
      var camera_options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(camera_options).then(function(imageData) {
        var image = document.getElementById('myImage');
        $scope.user.photo = "data:image/jpeg;base64," + imageData;
        LoadingService.hideLoading();
      }, function(error) {
      
      });
    }


    $scope.launch_photo_library = function() {
      LoadingService.showLoading();
      var photo_library_options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        mediaType: Camera.MediaType.PICTURE
      };

      $cordovaCamera.getPicture(photo_library_options).then(function(imageData) {
        // console.log(imageData);
        $scope.user.photo = "data:image/jpeg;base64," + imageData;
        LoadingService.hideLoading();
        //console.log(image.src);
      }, function(error) {
        LoadingService.hideLoading();
      });
    }
  }, false);

  $scope.updateParentParticulars = function(){
    $http.put($auth.apiUrl() + "/mobile_api/users/update", $scope.user).
    success(function() {
      alert("Your profile has been updated.");
    }).
    error(function() {

    });
  }

  
})
.controller('FamilyCtrl',function($scope, $stateParams, $ionicPlatform, $state, $auth, GlobalFactory) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.children = GlobalFactory._get_my_children();
    $scope.family_members = GlobalFactory._get_my_family();
  });
  
  
});

