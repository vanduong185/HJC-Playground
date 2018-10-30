myApp.controller('Project_ShareController', ['ProjectAPI', 'project_data', '$rootScope', '$scope', '$state', '$http', '$uibModal', '$uibModalInstance',
  function (ProjectAPI, project_data, $rootScope, $scope, $state, $http, $uibModal, $uibModalInstance) {
    
    $scope.list_viewer = project_data.data.project.viewers;

    $scope.addViewer = function (viewer) {
      if ($scope.viewer != null) {
        if ($scope.list_viewer.indexOf(viewer) == -1) {
          $scope.list_viewer.push(viewer);
          $scope.viewer = null;
        }
      }
    }

    $scope.removeViewer = function (viewer) {
      for (var i = 0; i < $scope.list_viewer.length; i++) {
        if ($scope.list_viewer[i] == viewer) {
          $scope.list_viewer.splice(i, 1);
        }
      }
    }

    $scope.shareProject = function () {
      if ($scope.list_viewer.length >= 0) {
        ProjectAPI.shareProject($scope.list_viewer, project_data.data.project.project_id).success(function (response) {
          if (response.message == "Success") {
            toastr.success("Shared successfully !");
            $uibModalInstance.close();
          }
          else {
            toastr.error("Some viewers didn't exist.")
          }
        })
      }
    }

    $scope.close = function () {
      $uibModalInstance.close();
    }
  }
])
