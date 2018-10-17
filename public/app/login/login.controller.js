myApp.controller("LoginController", ["$scope", "$rootScope", "$location", "Auth", "$uibModalInstance", "$uibModal",
  function($scope, $rootScope, $location, Auth, $uibModalInstance, $uibModal) {
    Auth.ClearCredentials();

    $scope.login = function () {
      Auth.Login($scope.username, $scope.password, function(response) {
        if(response.success) {
          $uibModalInstance.close();
          Auth.SetCredentials($scope.username, $scope.password);
          $location.path("/home");
        } else {
          $scope.error = response.message;
        }
      });
    };

    $scope.close = function() {
      $uibModalInstance.close();
    };
  }
])
