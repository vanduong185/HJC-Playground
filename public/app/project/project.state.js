myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('projects', {
      url: "/projects",
      templateUrl: "views/projects/index.html",
      controller: 'Project_IndexController'
    })
    .state('projects.list', {
      url: "/list",
      templateUrl: "views/projects/list.html",
      resolve: {
        projects_data: ['ProjectAPI', '$stateParams', function(ProjectAPI, $stateParams){
          return ProjectAPI.getProjects();
        }]
      },
      controller: 'Project_ListController'
    })
    .state('projects.show', {
      url: "/:project_id",
      templateUrl: "views/projects/show.html",
      resolve: {
        project_data: ['ProjectAPI', '$stateParams', function (ProjectAPI, $stateParams) {
          return ProjectAPI.getProject($stateParams.project_id);
        }],
        libraries_data: ['ProjectAPI', function (ProjectAPI) {
          return ProjectAPI.getLibraries();
        }]
      },
      controller: 'Project_ShowController'
    })
})
