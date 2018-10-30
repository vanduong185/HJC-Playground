myApp = angular.module('app', ['Authentication', 'ngCookies', 'ui.router', 'ui.bootstrap', 'ngBootbox']);

myApp.run(["$rootScope", "$location", '$cookieStore', '$http', '$state',
  function ($rootScope, $location, $cookieStore, $http, $state) {
    $rootScope.globals = $cookieStore.get("globals") || {};
    $rootScope.state = $state;
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common["Authorization"] = "Basic " + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
      if ($location.path() !== "/home" && $location.path() !== "/playground/guest" && $location.path() !== "/signUp" && !$rootScope.globals.currentUser) {
        $location.path("/home");
      }
    });
  }
])
