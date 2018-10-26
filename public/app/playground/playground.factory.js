myApp.factory('GuestProject', ['$http', '$rootScope', function ($http, $rootScope) {
  return {
    get_libraries: function () {
      return $.get("https://api.cdnjs.com/libraries")
    },
    searchLibraries: function (query) {
      return $.get("https://api.cdnjs.com/libraries?search=" + query)
    },
    get_guest_project : function() {
      return $http.get("/playground/guest");
    }
  }  
}])
