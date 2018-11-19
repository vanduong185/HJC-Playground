myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('projects', {
      url: "/projects",
      templateUrl: "views/projects/index.html"
    })
    .state('projects.dashboard', {
      url: "/dashboard",
      templateUrl: "views/projects/dashboard2.html",
      controller: 'Project_DashboardController'
    })
    .state('projects.dashboard.list', {
      url: "/list",
      templateUrl: "views/projects/list.html",
      resolve: {
        projects_data: ['ProjectAPI', '$stateParams', function(ProjectAPI, $stateParams){
          return ProjectAPI.getProjects();
        }]
      },
      controller: 'Project_ListController'
    })
    .state('projects.dashboard.shared_project', {
      url: "/shared_project",
      templateUrl: "views/projects/list_shared_project.html",
      resolve: {
        shared_projects_data: ['ProjectAPI', '$stateParams', function(ProjectAPI, $stateParams){
          return ProjectAPI.getSharedProjects();
        }]
      },
      controller: 'SharedProject_ListController'
    })
    .state('projects.show_shared_project', {
      url: "/shared_project/:project_id",
      templateUrl: "views/projects/show_shared_project2.html",
      resolve: {
        shared_project_data: ['ProjectAPI', '$stateParams', function (ProjectAPI, $stateParams) {
          return ProjectAPI.getSharedProject($stateParams.project_id);
        }]
      },
      controller: 'SharedProject_ShowController'
    })
    .state('projects.show', {
      url: "/:project_id",
      templateUrl: "views/projects/show2.html",
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
