myApp.controller('SharedProject_ListController', ['shared_projects_data', 'ProjectAPI', '$rootScope', '$scope', '$state', '$http',
  function (shared_projects_data, ProjectAPI, $rootScope, $scope, $state, $http) {
    $scope.shared_projects = shared_projects_data.data.shared_projects;
  }
])
