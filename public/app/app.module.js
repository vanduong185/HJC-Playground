myApp = angular.module('app', ['Authentication', 'ngCookies', 'ui.router', 'ui.bootstrap', 'ngBootbox']);

myApp.run(["$rootScope", "$location", '$cookieStore', '$http', '$state',
  function ($rootScope, $location, $cookieStore, $http, $state) {
    $rootScope.globals = $cookieStore.get("globals") || {};
    $rootScope.state = $state;
    if ($rootScope.globals.token) {
      $http.defaults.headers.common["Authorization"] = $rootScope.globals.token;
    }
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
      if ($location.path() !== "/home" && $location.path() !== "/playground/guest" && $location.path() !== "/signUp" && !$rootScope.globals.currentUser) {
        $location.path("/home");
      }
    });

    renderConsole = function(e) {
      if (~e.origin.indexOf('http://54.152.229.227:8081')) {
        let log = document.createElement("div");
        if (e.data.type == "log-msg") {
          log.className = "logger";
          if (typeof e.data.content === "object") {
            log.textContent = JSON.stringify(e.data.content);
          }
          else {
            log.textContent = e.data.content;
          }
        }
        if (e.data.type == "error-msg") {
          log.className = "logger";
          if (typeof e.data.content === "object") {
            log.textContent = JSON.stringify(e.data.content);
          }
          else {
            log.innerHTML = '<p class="margin-bot"><strong>' + e.data.position + "</strong></p>" + '<span class="red">' + e.data.content + "</span>";
          }
        }
        if (document.getElementById("console") != null) {
          document.getElementById("console").appendChild(log);
        }
      }
      else {
        return;
      }
    }

    window.addEventListener("message", renderConsole, false);
  }
])
