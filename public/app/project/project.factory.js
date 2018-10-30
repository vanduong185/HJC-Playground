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
    },
    createProject: function(new_project) {
      return $http.post('/projects/' + $rootScope.globals.currentUserInfo.user_id,
        {new_project: new_project});
    },
    deleteProject: function(project_id) {
      return $http.delete('/projects/' + $rootScope.globals.currentUserInfo.user_id + '/' + project_id)
    },
    shareProject: function(viewers, project_id) {
      return $http.post('/projects/' + $rootScope.globals.currentUserInfo.user_id + '/' + project_id + "/share",
        {viewers: viewers});
    },
    getSharedProjects: function() {
      return $http({
        method: "GET",
        url: '/shared_projects/' + $rootScope.globals.currentUserInfo.user_id,
        headers: { 'Content-Type': 'application/json' }
      })
    },
    getSharedProject: function(project_id) {
      return $http({
        method: "GET",
        url: '/shared_projects/' + $rootScope.globals.currentUserInfo.user_id + "/" + project_id,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}])
