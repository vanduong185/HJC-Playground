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

  var playgroundState = {
    name: 'playground',
    url: '/playground',
    templateUrl: 'views/playground.html',
    controller: "PlaygroundController"
  }

  $stateProvider.state(usersState);
  $stateProvider.state(homeState);
  $stateProvider.state(playgroundState);

  $urlRouterProvider.otherwise('/home');

  $locationProvider.html5Mode(false);
});
