myApp.controller('Project_ListController', ['projects_data', 'ProjectAPI', '$rootScope', '$scope', '$state', '$http',
  function (projects_data, ProjectAPI, $rootScope, $scope, $state, $http) {
    console.log(projects_data);
    $scope.projects = projects_data.data.projects;
}])
