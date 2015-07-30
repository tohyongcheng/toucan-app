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
      alert("Error registering user. Please try again.", resp);
      // handle error response
    });
  };

  $scope.goBack = function() {
    $state.go('landing');
  }
})


.controller('SettingsCtrl', function($scope, $auth, $state, $rootScope, $http, $ionicPopup, LoadingService, GlobalFactory) {
  $scope.settings = {};

  $scope.$on('$ionicView.beforeEnter', function() {
    LoadingService.showLoading();
    $scope.selected_children = {};
    $scope.children = GlobalFactory._get_my_children();
    $scope.all_settings = {};
    var children_id = [];
    var children_id_string = "";
    for (var i = 0; i < $scope.children.length; i++) {
      children_id.push($scope.children[i].id);
    }
    children_id_string = children_id.join(",");

    $http.get($auth.apiUrl() + "/mobile_api/toucan_devices/"+children_id_string).success(function(data){
      LoadingService.hideLoading();
      $scope.all_settings = data;
      if (children_id.length > 0) {
        $scope.toggle_child($scope.children[0]);  
      }
      
    }).error(function(err){

    });
  });

  $scope.is_selected = function(child) {
    if ($scope.selected_children == child.id ) return "child-selected";
    else return "child-not-selected";
  }

  $scope.toggle_child = function(child) {
    if (!($scope.selected_children) && (child.id == $scope.selected_children)) {
      $scope.selected_children = null;  
      $scope.settings = null;
    } else {
      $scope.selected_children = child.id;
      console.log($scope.all_settings[child.id]);
      $scope.settings = {
        update_frequency: $scope.all_settings[child.id].update_frequency,
        battery_level_update: $scope.all_settings[child.id].battery_level_update,
        machine_uuid: $scope.all_settings[child.id].machine_uuid.toUpperCase(),
        battery: $scope.all_settings[child.id].battery
      };
    }
  }

  $scope.update_settings = function() {
    $http.put($auth.apiUrl() + "/mobile_api/toucan_devices/"+$scope.selected_children, $scope.settings).success(function(data) {
      console.log(data);
      $ionicPopup.alert({
         title: 'Success',
         template: 'Successfully Updated!'
       });
    }).error(function(err){
      alert("Error!");
      console.log(err);
    })
  }

})

.controller('UpdatePasswordCtrl', function($scope, $auth, $state, $rootScope) {
  $scope.passwordForm = {};
  $scope.$on('$ionicView.beforeEnter', function() {
    
  });
})

.controller('EditChildCtrl', function($scope, $auth, $state, $rootScope, $ionicPlatform, $http, $cordovaCamera, $ionicHistory, $stateParams, LoadingService, GlobalFactory) {
  
  // Setup BeforeEnter
  $scope.$on('$ionicView.beforeEnter', function() {
    console.log($stateParams);
    $scope.childForm = GlobalFactory._get_my_children()[$stateParams.id];
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
  }, false);



  $scope.update_child = function(){
    $http.put($auth.apiUrl() + "/mobile_api/children/"+$scope.childForm.id, $scope.childForm).success(function(data){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go("app.home");        
    }).error(function(data) {
      alert("There was an error updating the child.", data);
    });
  };  

  $scope.validate_first_step = function() {
    if (($scope.childForm.name == null) || ($scope.childForm.name == "")) return true;
    if (($scope.childForm.birthday == null) || ($scope.childForm.birthday == "")) return true;
    if (($scope.childForm.mobile_number == null) || ($scope.childForm.birthday == "")) return true;
    return false;
  }
})

.controller('CreateChildCtrl', function($scope, $auth, $state, $rootScope, $cordovaDatePicker, $ionicPlatform, $http, $cordovaBarcodeScanner, $cordovaCamera, $ionicHistory, LoadingService) {
  
  // Setup BeforeEnter
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.showChildParticulars = true;
    $scope.childForm = { gender: "boy"};
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
      console.log($ionicHistory.currentView());
      if ($ionicHistory.currentView().stateName == "createFirstChild") {
        $state.go("app.emergency");
      } else {
        $state.go("app.home");        
      }

    }).error(function(data) {
      alert("There was an error creating the child.", data);
    });
  };  

  $scope.nextStep = function() {
    console.log("next step");
    $scope.showChildParticulars = false;
  }

  $scope.goBack = function() {
    console.log("go back");
    if ($scope.showChildParticulars) $ionicHistory.goBack();
    else $scope.showChildParticulars = true;
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

.controller('SetupMyAccountCtrl', function($scope, $auth, $state, $rootScope, $cordovaCamera, $ionicPlatform, LoadingService) {

  $scope.parentForm = {};
  $scope.parentForm = { relationship: "mother" };
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

.controller('HomeCtrl', function($scope, $rootScope, $http, $auth, $localStorage, $ionicSlideBoxDelegate, $state, $ionicPopup, $timeout, $cordovaPush, $cordovaDevice, $cordovaDialogs, GlobalFactory, LoadingService) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.init();
  }); 

  $scope.init = function() {
    LoadingService.showLoading();
    $scope.getChildren();
    $scope.getFamily();
  }

  $scope.getChildren = function() {
    $scope.children = [];
    $ionicSlideBoxDelegate.update();
    $ionicSlideBoxDelegate.slide(0);
    $http.get($auth.apiUrl() + "/mobile_api/users/"+$localStorage.user_id).
    success(function(data) {
      console.log(data);
      GlobalFactory._set_my_children(data.children);
      $scope.children = data.children;
      if (data.children.length > 0) {
        // alert("Please create a child!");
        $scope.selected_child = $scope.children[0];
        $scope.notifications = $scope.children[0].latest_notifications;
        $scope.checkForEmergency();
        $ionicSlideBoxDelegate.update();
      }
      LoadingService.hideLoading();
    }).
    error(function(data) {
      console.log("error", data);
    });   
  }

  $scope.getFamily = function() {
    $http.get($auth.apiUrl() + "/mobile_api/users/").
    success(function(data) { 
      console.log("family", data);
      GlobalFactory._set_my_family(data);
    }).
    error(function(data){
      console.log("error getting family");
    });
  }

  document.addEventListener("deviceready", function(){
    // Recommended to unregister before registering.
    $cordovaPush.unregister({}).then(function(result) {
    }, function(err) {
    });

    var config = null;
    if (ionic.Platform.isIOS()) {
      config = {
        "badge": true,
        "sound": true,
        "alert": true,
      };
    }

    $cordovaPush.register(config).then(function(result) {
      // Success -- send deviceToken to server, and store for future use
      console.log("device token result: " + result)
      // Only iOS one is set here
      if (ionic.Platform.isIOS()) {
        var device_type = $cordovaDevice.getPlatform();
        var device_token = result;
        var formData = { device_type: device_type, device_token: device_token };
        $http.post($auth.apiUrl() + "/mobile_api/user_devices", formData).success(function(data) {
          console.log("successfully posted device token", data);
        }).error(function(err) {
        });
      }
    }, function(error) {
      
    });

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      $scope.getChildren();
      if (ionic.Platform.isIOS()) {
          handleIOS(notification);
      }
    });
  }, false);


  handleIOS = function(notification) {
    console.log('notification: ', notification);
    if (notification.alert) {
      navigator.notification.alert(notification.alert);
      console.log('alert: ', notification.alert);
      $state.go("app.home");
    }

    if (notification.sound) {
      var snd = new Media(event.sound);
      snd.play();
      console.log('sound: ', notification.sound);
    }

    if (notification.badge) {
      $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
        // Success!
        console.log('badge: ', notification.badge);
      }, function(error) {
        
      });
    }
  }


  $scope.slideHasChanged = function(idx) {
    if (idx < $scope.children.length) {
      $scope.selected_child = $scope.children[idx];
      $scope.notifications = $scope.children[idx].latest_notifications;
    } else {
      $scope.selected_child = null;
      $scope.notifications = [];
    }
  }

  $scope.checkForEmergency = function() {
    for (var i=0; i < $scope.children.length; i++) {
      if ($scope.children[i].require_response) {
        var alertPopup = $ionicPopup.alert({
           title: 'EMERGENCY!',
           template: $scope.children[i].name + ' has activated the SOS button! Confirm to start a voice call now.'
         });
         alertPopup.then(function(res) {
           $rootScope.callNumber($scope.children[i].mobile_number);
           $http.get($auth.apiUrl() + "/mobile_api/children/" + $scope.children[i].id + "/disable_emergency").success(function(data) {
            console.log("disabled emergency");
           }).error(function(err){
            console.log("error disabling emergency");
           })
         });
        break;
      }
    }
  }

  $rootScope.callNumber = function(n) {
    window.open('tel:' + n, '_system');
  }

  $scope.notificationClassType = function(notification_type) {
    if (notification_type == "location") return "ion-location";
    if (notification_type == "audio") return "ion-mic-a";
    if (notification_type == "ping") return "ion-radio-waves";
    if (notification_type == "battery") return "ion-battery-low";
    if (notification_type == "sos") return "ion-alert";

    return "";
  }

  $scope.happiness_face = function(val) {
    if (val < 20) return "img/20.png";
    else if (val < 40) return "img/40.png";
    else if (val < 60) return "img/60.png";
    else if (val < 80) return "img/80.png";
    else return "img/100.png";
  }


  $scope.happiness_text = function(val) {
    var emotion;
    if (val < 20) emotion = " may be feeling neglected. You should ping";
    else if (val < 40) emotion = " may be missing you. How about sending a short voice message to ";
    else if (val < 60) emotion = " is feeling happy but a little more attention would definitely excite ";
    else if (val < 80) emotion = " is happy. Keep it up! Ping";
    else emotion = "is thrilled because you are constantly talking to";

    return emotion;
    
  }

  $scope.gender_select = function(val) {
    var gender;
    if (val == "boy") gender = "him";
    else gender = "her";

    return gender;
  }

})

.controller('EditEmergencyMobileNumbersCtrl', function($scope, $http, $auth, $localStorage, $ionicPlatform, $cordovaCamera, LoadingService, $state, $ionicHistory) {
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.submitForm = {mobile_numbers: []};
    $scope.get_current_numbers();
  }); 

  $scope.get_current_numbers = function() {
    $http.get($auth.apiUrl()+"/mobile_api/families").success(function(data){
      if ((data.mobile_numbers) && (data.mobile_numbers.length > 0))
        $scope.submitForm.mobile_numbers = data.mobile_numbers;
    }).error(function(err){

    })
  }

  $scope.update_mobile_numbers = function() {
    console.log("submitForm", $scope.submitForm);
    $http.put($auth.apiUrl()+"/mobile_api/families/1", $scope.submitForm).success(function(data){
      // alert("Emergency mobile numbers updated.");
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go("app.home");
      console.log(data);
    }).error(function(err) {
      console.log(err);
    })
  }
})


.controller('CreateFamilyMemberCtrl', function($scope, $http, $auth, $localStorage, $ionicPlatform, $ionicPopup, $cordovaCamera, LoadingService, $state) {
  $scope.parentForm = { relationship: "mother" };
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
    LoadingService.showLoading();
    $http.post($auth.apiUrl() + "/mobile_api/users", $scope.parentForm)
    .success(function(data) {
      LoadingService.hideLoading();
      var pop = $ionicPopup.alert({
         title: 'Success',
         template: 'Family Member created!'
       });

      pop.then(function(res) {
        $state.go("app.home");
      });
      
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

      $scope.map = { center: { latitude: 1.3000, longitude: 103.8 }, zoom: 11 };
      $scope.markers = [];

      for (key in $scope.locations) {
        var len = $scope.locations[key].length;
        $scope.max_timestep_length = Math.max(len, $scope.max_timestep_length);
        if (len > 0) {
          $scope.markers.push({
            id: key,
            coords: {
              latitude: $scope.locations[key][0].lat,
              longitude: $scope.locations[key][0].lng
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
    $scope.markers = [];
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

.controller('PingCtrl', function($scope, $http, $ionicModal, $ionicPopup, $auth, LoadingService, GlobalFactory) {
  
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
    LoadingService.showLoading();
    angular.forEach($scope.selected_children, function(value, key) {
      var data = {
        ping_message : { color: color, child_id: parseInt(key) }
      };

      $http.post($auth.apiUrl() + "/mobile_api/ping_messages", data).then(function(success) {
        LoadingService.hideLoading();
        $ionicPopup.alert({
          title: 'Success',
          template: 'Ping sent!'
        });
      }, function(error){
        console.log(error);
      });
    })
  }
})

.controller('MediaCtrl',function($scope, $stateParams, $ionicPlatform, $ionicPopup, $cordovaFile, $cordovaMedia, $cordovaFileTransfer, $timeout, LoadingService, $http, GlobalFactory, $auth) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.audio_file = null;
    $scope.audio_file_entry = null;
    $scope.audio_recordings = [];
    $scope.currently_playing = null;
    
    $scope.selected_children = {};
    $scope.children = GlobalFactory._get_my_children();
    if ($scope.children.length > 0) {
      $scope.toggle_child($scope.children[0]);
    }
    $scope.ft = new FileTransfer();
    console.log(Media);
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
    var recTime = 0;
    var recInterval = setInterval(function() {
      var snd = new Media(event.sound);
      snd.play();
      clearInterval(recInterval);
    }, 1000);
  }

  $scope.stop_record = function() {
    $scope.audio_file.stopRecord();
    if (ionic.Platform.isIOS()) { 
      $cordovaFile.checkFile(cordova.file.documentsDirectory, "myrecording.m4a").then(function(success) {
        $scope.audio_file_entry = success;
        console.log("The audio is " +  $scope.audio_file.getDuration() + "seconds long.");
      });
    }

    if (ionic.Platform.isAndroid()) { 
      
    }
    
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
    var options = {chunkedMode: true, fileKey: "file", fileName: "recording.m4a", mimeType: "audio/m4a", httpMethod: "POST", 
                    headers: $auth.retrieveData('auth_headers'), params: {}
                  };
    var children_id = [];
    for (key in $scope.selected_children) {
      children_id.push(key);
    }
    console.log("children id",children_id);
    options.params = { child_id: children_id.join() };
    var server = encodeURI($auth.apiUrl() + "/mobile_api/audio_messages");
    var filePath = $scope.audio_file_entry.nativeURL;
    console.log('filePath', filePath);
    console.log("child id params",options.params.child_id);
    LoadingService.showLoading();

    var win = function (result) {
      $ionicPopup.alert({
         title: 'Success',
         template: 'Voice Message sent!'
       });
      $scope.audio_file = null;
      LoadingService.hideLoading();
    }

    var fail = function(err) {
      $ionicPopup.alert({
        title: 'Oh no!',
        template: 'Voice Message was not sent. Please try again!'
      });
    }

    $scope.ft.upload(filePath, server, win, fail, options);
  }

  $scope.audio_file_disabled = function() {
    if (($scope.audio_file != null) && ((Object.keys($scope.selected_children).length > 0))) return false;
    return true;
  }

})
.controller('VoiceLogCtrl',function($scope, $stateParams, $ionicPlatform, $cordovaFile, $cordovaMedia, $cordovaCapture, $cordovaFileTransfer, $timeout, LoadingService, $http, $auth, GlobalFactory) {
  $scope.$on('$ionicView.beforeEnter', function() {
    
    LoadingService.showLoading();
    $scope.children = GlobalFactory._get_my_children();
    $scope.audio_recordings = [];
    $scope.selected_child = null;
    
    var children_id = [];
    var children_id_string = "";
    for (var i = 0; i < $scope.children.length; i++) {
      children_id.push($scope.children[i].id);
    }
    children_id_string = children_id.join(",");
    $http.get($auth.apiUrl() + "/mobile_api/audio_messages?child_id="+children_id_string)
    .success(function(data) {
      $scope.all_audio_recordings = data;
      for (var key in $scope.all_audio_recordings) {
        if ($scope.all_audio_recordings.hasOwnProperty(key)) {
          $scope.all_audio_recordings[key].reverse();
        }
      }

      if (children_id.length > 0) {
        $scope.selected_child = $scope.children[0];
        $scope.toggle_child($scope.selected_child);  
      }
      
      LoadingService.hideLoading();
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
    }, function(status){
        
    });
    $scope.currently_playing.play();
  }

  $scope.is_selected = function(child) {
    if ($scope.selected_child == child.id ) return "child-selected";
    else return "child-not-selected";
  }

  $scope.toggle_child = function(child) {
    if (!($scope.selected_child) && (child.id == $scope.selected_child)) {
      $scope.selected_child = null;  
      $scope.audio_recordings = [];
    } else {
      $scope.selected_child = child.id;
      $scope.audio_recordings = $scope.all_audio_recordings[child.id];
      console.log($scope.audio_recordings);
    }
  }

  $scope.show_recordings = function() {
    if (($scope.recordings)&&($scope.recordings.length == 0)) return false;
    else return true;
  }

  $scope.recording_class = function(recording) {
    if (recording.message_type == "device") return "user-recording";
    else if (recording.message_type == "user") return "child-recording";
    return "user-recording";
  }
})
.controller('ProfileCtrl',function($scope, $stateParams, $cordovaCamera, $ionicPopup, $timeout, LoadingService, $http, $auth) {

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
      $ionicPopup.alert({
         title: 'Success',
         template: 'Your profile has been updated.'
       });
    }).
    error(function() {

    });
  }

  
})
.controller('FamilyCtrl',function($scope, $stateParams, $ionicPlatform, $state, $auth, $http, GlobalFactory, $localStorage) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.children = GlobalFactory._get_my_children();
    $scope.family_members = GlobalFactory._get_my_family();
    $scope.getFamily();
    $scope.getChildren();
  });
  
  $scope.getFamily = function() {
    $http.get($auth.apiUrl() + "/mobile_api/users/").
    success(function(data) { 
      console.log("family", data);
      GlobalFactory._set_my_family(data);
      $scope.family_members = GlobalFactory._get_my_family();
    }).
    error(function(data){
      console.log("error getting family");
    });
  }

  $scope.getChildren = function() {
    $scope.children = [];
    $http.get($auth.apiUrl() + "/mobile_api/users/"+$localStorage.user_id).
    success(function(data) {
      GlobalFactory._set_my_children(data.children);
      $scope.children = data.children;
    }).
    error(function(data) {
      console.log("error", data);
    });   
  }

});

