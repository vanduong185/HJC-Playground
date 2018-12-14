myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  var homeState = {
    name: 'home',
    url: '/home',
    templateUrl: 'views/home.html',
    controller: "HomeController"
  };

  var signUpState = {
    name: 'signUp',
    url: '/signUp',
    templateUrl: 'views/users/signUpForm.html',
    controller: "SignUpController"
  };
  var profileState = {
    name: 'profile',
    url: '/profile',
    templateUrl: 'views/profile/profile.html',
    controller: "ProfileController"
  };
  
  $stateProvider.state(profileState);
  $stateProvider.state(signUpState);
  $stateProvider.state(homeState);

  $urlRouterProvider.otherwise('/home');

  $locationProvider.html5Mode(false);
});
