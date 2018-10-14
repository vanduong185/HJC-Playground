angular.module('app').controller("LoginController", ['$scope', '$uibModal', '$uibModalInstance', function($scope, $uibModal, $uibModalInstance) {
  $scope.close = function() {
    $uibModalInstance.close();
  };
}])
