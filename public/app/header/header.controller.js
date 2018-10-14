angular.module('app').controller("HeaderController", ['Auth', '$location', '$rootScope', '$scope', '$http', '$uibModal',
  function(Auth, $location, $rootScope, $scope, $http, $uibModal) {
    $scope.showLoginModal = function () {
      Auth.showLoginModal();
    }

    $scope.logout = function() {
      Auth.ClearCredentials();
      $location.path("/home");
    }
  }
])
