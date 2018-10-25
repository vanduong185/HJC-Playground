myApp.factory('ProjectAPI', ['$http', '$rootScope', function ($http, $rootScope) {
  return {
    getLibraries: function () {
      return $.get("https://api.cdnjs.com/libraries")
    },
    searchLibraries: function (query) {
      return $.get("https://api.cdnjs.com/libraries?search=" + query)
    },
    getProjects: function() {
      return $http({
        method: "GET",
        url: '/projects/' + $rootScope.globals.currentUserInfo.user_id,
        headers: { 'Content-Type': 'application/json' }
      })
    },
    getProject: function(project_id) {
      return $http({
        method: "GET",
        url: '/projects/' + $rootScope.globals.currentUserInfo.user_id + '/' + project_id,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}])
