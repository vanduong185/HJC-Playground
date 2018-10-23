myApp = angular.module('app', ['Authentication', 'ngCookies', 'ui.router', 'ui.bootstrap']);

myApp.run(["$rootScope", "$location", '$cookieStore', '$http',
  function ($rootScope, $location, $cookieStore, $http) {
    $rootScope.globals = $cookieStore.get("globals") || {};
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common["Authorization"] = "Basic " + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
      // if($location.path() == "/signUp"){
      //   $location.path("/signUp");
      // }
       if ($location.path() !== "/home" && $location.path() !== "/signUp" && !$rootScope.globals.currentUser) {
        $location.path("/home");
      }
    });
  }
])
