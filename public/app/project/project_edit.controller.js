myApp.controller('Project_EditController', ['ProjectAPI', 'project_data_edit', '$rootScope', '$scope', '$state', '$http', '$uibModal', '$uibModalInstance',
  function (ProjectAPI, project_data_edit, $rootScope, $scope, $state, $http, $uibModal, $uibModalInstance) {
    $scope.close = function () {
      $uibModalInstance.close();
    }

    $scope.project = project_data_edit.data.project;

    $scope.update_project = {
      project_name: ""
    }

    $scope.updateProject = function() {
      if ($scope.project.project_name != $scope.update_project.project_name) {
        ProjectAPI.updateProject($scope.project.project_id, $scope.update_project).success(function (response) {
          console.log(response);
          if (response.message == "Success") {
            toastr.success("Update successfully.");
            $uibModalInstance.close();
            $state.reload($state.current);
          }
          else if (response.message == "Already exist") {
            toastr.error("This project's name already exists.");
          }
          else {
            toastr.error("Something went wrong.");
          }
        })
      }
    }
  }
])