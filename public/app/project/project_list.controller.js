myApp.controller('Project_ListController', ['projects_data', 'ProjectAPI', '$rootScope', '$scope', '$state', '$http', '$ngBootbox', '$uibModal',
  function (projects_data, ProjectAPI, $rootScope, $scope, $state, $http, $ngBootbox, $uibModal) {
    $scope.projects = projects_data.data.projects;

    $scope.deleteProject = function (project_id) {
      ProjectAPI.deleteProject(project_id).success(function (response) {
        if (response.message == 'deleted') {
          $state.reload($state.current);
        }
      })
    }

    $scope.showDeleteModal = function (project_id) {
      $ngBootbox.confirm('Are you sure delete this project?').then(function () {
        ProjectAPI.deleteProject(project_id).success(function (response) {
          if (response.message == 'deleted') {
            $state.reload($state.current);
            toastr.success("Deleted sucessfully !");
          } else {
            toastr.error("Something went wrong !");
          }
        });
      });
    }

    $scope.showShareModal = function (project) {
      $uibModal.open({
        templateUrl: 'views/projects/share.html',
        resolve: {
          project_data: ['ProjectAPI', function (ProjectAPI) {
            return ProjectAPI.getProject(project.project_id);
          }]
        },
        controller: "Project_ShareController"
      })
    }

    $scope.showEditModal = function (project) {
      $uibModal.open({
        templateUrl: "views/projects/edit.html",
        resolve: {
          project_data_edit: ['ProjectAPI', function (ProjectAPI) {
            return ProjectAPI.getProject(project.project_id);
          }]
        },
        controller: "Project_EditController"
      })
    }
  }
])
