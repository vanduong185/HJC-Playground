myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('users', {
      url: "/users",
      templateUrl: "views/users/index.html"
    })
    .state('users.list_user', {
      url: "/list_user",
      templateUrl: "views/users/list_user.html",
      resolve: {
        users_data: ['UserAPI', '$stateParams', function (UserAPI, $stateParams) {
          return UserAPI.get_users({
            options: {
              keyword: null,
              paginate: { page: 1}
            }
          });
        }]
      },
      controller: "UserListController"
    })
})
