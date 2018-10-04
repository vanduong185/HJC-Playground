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
  $http.get('/playground').success(function(response) {
    console.log("got response");
    console.log(response);
    var editor = CodeMirror(document.getElementById("codeeditor"), {
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

    var showTreeView = function () {

      project_data = [
          {
              '1' : [{'1.1' : [{'1.1.1': []}]}, {'1.2': []} ]
          },
          {
              '2' : [{'2.1' : []}, {'2.2' : []} ]
          }
      ]; 
      
      tree_data = [{
          text: "root",
          children: []
      }];

      var convert_tree_data = function(data, tree_data) {
          
          for (var i=0; i< data.length; i++)
          {
              parent = Object.keys(data[i])[0];
              if (Object.values(data[i])[0].length > 0) {
                  tmp = [{ 
                      text: parent,
                      children: []
                  }]
              }
              else {
                  tmp = [{ 
                      text: parent,
                      children: [],
                      icon: "fa fa-file icon-state-warning icon-lg"
                  }]
              }
              tree_data[0].children.push(tmp[0]);
              convert_tree_data(Object.values(data[i])[0], tmp);
          }
          return tree_data;
      }

      var tree = angular.element(document.getElementById("tree_1")).jstree ({
          'core' : {
              'theme' : {
              'responsive' : false
              },
              'data': response
          },
          'types' : {
              'default': {icon: "fa fa-folder icon-state-warning icon-lg"},
              'file': {icon: "fa fa-file icon-state-warning icon-lg"}
          },
          'plugins':['types']
          
      });

      angular.element(document.getElementById('tree_1')).on('select_node.jstree', function(e, data) {
        console.log(data);
        editor.setValue(data.node.data);
      });
    };
      
    showTreeView();
  });
}]);
