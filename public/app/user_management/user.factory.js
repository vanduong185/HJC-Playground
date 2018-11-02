myApp.factory('UserAPI', ['$http', '$rootScope', function ($http, $rootScope) {
  return {
    sign_up: function(user) {
      return $http.post("/users/signup", {user: user});
    }
  }
}])