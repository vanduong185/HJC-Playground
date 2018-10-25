myApp.controller('Project_ListController', ['projects_data', 'ProjectAPI', '$rootScope', '$scope', '$state', '$http', '$ngBootbox',
  function (projects_data, ProjectAPI, $rootScope, $scope, $state, $http, $ngBootbox) {
    console.log(projects_data);
    $scope.projects = projects_data.data.projects;

    $scope.new_project = {
      name: ""
    }

    $scope.createProject = function () {
      ProjectAPI.createProject($scope.new_project).success(function (response) {
        console.log(response);
        if(response.message == 'success') {
          $state.reload($state.current);
        }
        else {
          toastr.error("Something went wrong !");
        }

      })
    }

    $scope.deleteProject = function (project_id) {
      ProjectAPI.deleteProject(project_id).success(function (response) {
        console.log(response);
        if(response.message == 'deleted') {
          $state.reload($state.current);
        }
      })
    }

    $scope.showDeleteModal = function(project_id) {
      $ngBootbox.confirm('Are you sure delete this project?').then(function() {
        ProjectAPI.deleteProject(project_id).success(function(response) {
          if(response.message == 'deleted') {
            $state.reload($state.current);
            toastr.success("Deleted sucessfully !");
          } else {
            toastr.error("Something went wrong !");
          }
        });
      });
    }
  }
])
