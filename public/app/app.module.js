myApp = angular.module('app', ['Authentication', 'ngCookies', 'ui.router', 'ui.bootstrap']);

myApp.run(["$rootScope", "$location", '$cookieStore', '$http',
  function ($rootScope, $location, $cookieStore, $http) {
    $rootScope.globals = $cookieStore.get("globals") || {};
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common["Authorization"] = "Basic " + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
      if ($location.path() !== "/home" && !$rootScope.globals.currentUser) {
        $location.path("/home");
      }
    });
  }
])