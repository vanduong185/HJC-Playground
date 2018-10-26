myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  var homeState = {
    name: 'home',
    url: '/home',
    templateUrl: 'views/home.html',
    controller: "HomeController"
  };

  var usersState = {
    name: 'users',
    url: '/users',
    templateUrl: 'views/users.html',
    controller: "UserController"
  };

  $stateProvider.state(usersState);
  $stateProvider.state(homeState);

  $urlRouterProvider.otherwise('/home');

  $locationProvider.html5Mode(false);
});
