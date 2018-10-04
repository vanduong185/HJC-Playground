var myApp = angular.module('demoApp', ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  var homeState = {
    name: 'home',
    url: '/home',
    templateUrl: 'views/home.html'
  };

  var aboutState = {
    name: 'about',
    url: '/about',
    templateUrl: 'views/about.html'
  };

  var usersState = {
    name: 'users',
    url: '/users',
    templateUrl: 'views/users.html',
    controller: "UserController"
  };

  var helloState = {
    name: 'hello',
    url: '/hello',
    templateUrl: 'views/hello_angular.html'
  }

  var playgroundState = {
    name: 'playground',
    url: '/playground',
    templateUrl: 'views/playground.html',
    controller: "EditorController"
  }

  $stateProvider.state(aboutState);
  $stateProvider.state(usersState);
  $stateProvider.state(homeState);
  $stateProvider.state(helloState);
  $stateProvider.state(playgroundState);

  $urlRouterProvider.otherwise('/home');
});

myApp.controller('UserController', ['$scope', '$http', function($scope, $http){
  $http.get('/users').success(function(response) {
    console.log("got response");
    $scope.listPerson = response;
  });
}]);

myApp.controller('EditorController', ['$scope', '$http', function($scope, $http){
  var editor = CodeMirror(document.getElementById("codeeditor"), {
    value: "<!DOCTYPE html>\n<html>\n\t<head>\n\t</head>\n\t<body>\n\t</body>\n</html>\n",
    mode: "text/html",
    theme: "neo",
    tabSize: 2,
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    extraKeys: {"Ctrl-Space": "autocomplete"}
  });

  editor.on("change", function () {
    var text = editor.getValue();
    var idoc = document.getElementById('result-iframe').contentWindow.document;
    idoc.open();
    idoc.write(text);
    idoc.close();
  });

  $scope.showCode = function() {
    var text1 = editor.getValue();
    console.log(text1);
  }
  
}]);
// function UserController($scope, $http) {
//   $http.get('/users').success(function(response) {
//     console.log("got response");
//     $scope.listPerson = response;
//   });
// }
