myApp.controller('User_CreateController', ['UserAPI', '$rootScope', '$scope', '$state', '$http', '$ngBootbox', '$uibModal', '$uibModalInstance',
  function (UserAPI, $rootScope, $scope, $state, $http, $ngBootbox, $uibModal, $uibModalInstance) {

    $scope.close = function () {
      $uibModalInstance.close();
    }

    $scope.user = {
      email: null,
      password: null,
      nickname: null,
    }

    $scope.isDifferentPass = null;

    $scope.createUser = function () {
      if ($scope.user.password === $scope.rpassword) {
        UserAPI.sign_up($scope.user).success(function (response) {
          if (response.message == "Email existed") {
            $scope.signup_error = "This email existed. Please use another email."
          }
          else if (response.message == "Error") {
            $scope.signup_error = "Something went wrong."
          }
          else {
            toastr.success("Signup successfully.");
            $uibModalInstance.close();
            $state.reload($state.current);
          }
        });
      }
      else {
        $scope.isDifferentPass = true
      }
    };
}])
