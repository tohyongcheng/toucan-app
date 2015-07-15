app.service('LoadingService', function($ionicLoading, $ionicPopup) {
  var service = {
    showLoading: function() {
      $ionicLoading.show({
        template: '<p class="spinner-small-wrapper"><ion-spinner class="spinner-small"></ion-spinner></p>',
        noBackdrop: true,
        duration: 10000
      });
    },
    hideLoading: function() {
      $ionicLoading.hide();
    },
    popError: function() {
      $ionicPopup.alert({
        title: "Error",
        template: "There was an error processing the action. We will look into this matter ASAP!"
      })
    }
  };

  return service;
})

.service('SMSService', function($cordovaSms) {
  var service = {
    sendSMS: function(mobile_number,content) {
      console.log("SMSService Details", mobile_number, content);
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          // intent: 'INTENT'  // send SMS with the native android SMS messaging
          intent: '' // send SMS without open any other app
        }
      };
      if (mobile_number && (mobile_number != "")) {
        $cordovaSms
        .send(mobile_number, content, options)
        .then(function() {
          console.log("Success! SMS was sent");
        }, function(error) {
          console.log("An error occurred");
        });  
      }      
    }
  };
  return service;
});

