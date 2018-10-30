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

  var signUpState = {
    name: 'signUp',
    url: '/signUp',
    templateUrl: 'views/signUpForm.html',
    controller: "SignUpController"
  };
  
  $stateProvider.state(signUpState);
  $stateProvider.state(usersState);
  $stateProvider.state(homeState);

  $urlRouterProvider.otherwise('/home');

  $locationProvider.html5Mode(false);
});
