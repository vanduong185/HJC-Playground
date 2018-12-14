myApp.controller('SharedProject_ListController', ['shared_projects_data', 'ProjectAPI', '$rootScope', '$scope', '$state', '$http',
  function (shared_projects_data, ProjectAPI, $rootScope, $scope, $state, $http) {
    $scope.shared_projects = shared_projects_data.data.shared_projects;

    $scope.searchSharedProject = function() {
      ProjectAPI.getSharedProjects($scope.keyword).then(function (response) {
        console.log(response);
        $scope.shared_projects = response.data.shared_projects;
      })
    }
  }
])
