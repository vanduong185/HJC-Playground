myApp.controller("LoginController", ['UserAPI', '$timeout', "$window", "$state", "$http", "$scope", "$rootScope", "$location", "Auth", "$uibModalInstance", "$uibModal",
  function (UserAPI, $timeout, $window, $state, $http, $scope, $rootScope, $location, Auth, $uibModalInstance, $uibModal) {
    Auth.ClearCredentials();

    $scope.login = function () {
      Auth.Login($scope.username, $scope.password, function (response) {
        if (response.success) {
          Auth.SetCredentials($scope.username, $scope.password);
          $uibModalInstance.close();
        } else {
          $scope.error = response.message;
        }
      });
    };

    $scope.close = function () {
      $uibModalInstance.close();
    };

    $scope.title = "Log in";

    $scope.isLoginModal = true;
    $scope.isSignupModal = null;

    $scope.goToSignup = function () {
      $scope.isLoginModal = null;
      $scope.isSignupModal = true;
      $scope.title = "Sign up";
    }

    $scope.goToLogin = function () {
      $scope.isLoginModal = true;
      $scope.isSignupModal = null;
      $scope.title = "Log in";
      $scope.user = {
        email: null,
        password: null,
        nickname: null,
      };
      $scope.rpassword = null;
      $scope.isDifferentPass = null;
    }

    $scope.user = {
      email: null,
      password: null,
      nickname: null,
    }

    $scope.isDifferentPass = null;

    $scope.register = function () {
      if ($scope.user.password === $scope.rpassword) {
        UserAPI.sign_up($scope.user).success(function (response) {
          console.log(response)
          if (response.message == "Email existed") {
            $scope.signup_error = "This email existed. Please use another email."
          }
          else if (response.message == "Error") {
            $scope.signup_error = "Something went wrong."
          }
          else {
            toastr.success("Signup successfully.");
            $scope.goToLogin();
          }
        });
      }
      else {
        $scope.isDifferentPass = true
      }
    };
  }
])
