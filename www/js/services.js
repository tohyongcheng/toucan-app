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
});
