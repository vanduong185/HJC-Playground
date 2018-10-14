angular.module('app').controller("HeaderController", ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {
  $scope.login = function () {
    $uibModal.open({
      templateUrl: 'views/login.html',
      controller: "LoginController"
    })
  }
}])
