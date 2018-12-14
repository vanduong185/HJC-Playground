myApp.factory('UserAPI', ['$http', '$rootScope', function ($http, $rootScope) {
  return {
    sign_up: function (user) {
      return $http.post("/users/signup", { user: user });
    },
    get_users: function (data) {
      options = data.options;
      return $http.get("/users/" + JSON.stringify(options))
    },
    delete_user: function(user_id) {
      return $http.delete('/users/' + user_id);
    }
  }
}])