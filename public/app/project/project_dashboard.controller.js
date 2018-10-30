myApp.controller('Project_DashboardController', ['ProjectAPI', '$rootScope', '$scope', '$state', '$http',
  function (ProjectAPI, $rootScope, $scope, $state, $http) {
    $scope.new_project = {
      name: null
    }

    $scope.createProject = function () {
      if ($scope.new_project.name != null && $scope.new_project.name.length > 0) {
        ProjectAPI.createProject($scope.new_project).success(function (response) {
          if (response.message == 'success') {
            $state.reload($state.current);
            $scope.new_project.name = null;
          }
          else {
            toastr.error("Something went wrong !");
          }

        })
      }
    }
  }
])
