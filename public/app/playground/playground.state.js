myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('playground', {
      url: "/playground",
      templateUrl: "views/playground/index.html",
      controller: 'Playground_IndexController'
    })
    .state("playground.guest", {
      url: "/guest",
      templateUrl: "views/playground/guest2.html",
      resolve: {
        guest_project_data: ['GuestProject', function (GuestProject) {
          return GuestProject.get_guest_project();
        }],
        libraries_data: ['GuestProject', function (GuestProject) {
          return GuestProject.get_libraries();
        }]
      },
      controller: 'Playground_GuestController'
    })
})
