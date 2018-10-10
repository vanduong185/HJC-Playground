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

myApp.controller('UserController', ['$scope', '$http', function($scope, $http) {
  $http.get('/users').success(function(response) {
    console.log("got response");
    $scope.listPerson = response;
  });
}]);

myApp.controller('EditorController', ['$scope', '$http', function($scope, $http) {
  $http.get('/playground').success(function(response) {

    var username = response.text;

    // initialize editor with CodeMirror plugin
    var editor = CodeMirror(document.getElementById("codeeditor"), {
      mode: "html",
      theme: "neo",
      tabSize: 2,
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      extraKeys: {"Ctrl-Space": "autocomplete"}
    });

    // initialize treeview with jsTree plugin
    var tree = angular.element(document.getElementById("tree_1")).jstree ({
      'core' : {
          'check_callback': true,
          'theme' : {
          'responsive' : false
          },
          'data': response
      },
      'types' : {
          'default': {icon: "fa fa-folder gray icon-lg"},
          'file': {icon: "fa fa-file icon-state-warning icon-lg"},
          'file-html' : {icon: "fa fa-html5 orange icon-lg"},
          'file-css' : {icon: "fa fa-css3 blue icon-lg"},
          'file-js' : {icon: "fa fa-code red icon-lg"}
      },
      'plugins':['types']
    });

    // initialize result iframe 
    angular.element(document.getElementById('result-iframe'))[0].src = '../data/' + username + '/index.html';

    // fire event when select file or folder on tree view, set code of file for editor 
    var selected_file = {};
    var selected_folder = {};
    angular.element(document.getElementById('tree_1')).on('select_node.jstree', function(e, data) {
      var node = data.node;
      if (node.original.type != "folder"){
        switch (node.original.type) {
          case "file-html" : {
            editor.setOption("mode", "htmlmixed");
            break;
          }
          case "file-css" : {
            editor.setOption("mode", "css");
            break;
          }
          case "file-js" : {
            editor.setOption("mode", "javascript");
            break;
          }
          case "file" : {
            editor.setOption("mode", "text/plain");
            break;
          }
        }
        selected_file.path = node.original.path
        selected_file.id = node.id;
        selected_folder = null;
        editor.setValue(node.original.content);
      }
      else {
        selected_folder = {};
        selected_folder.path = node.original.path;
        selected_folder.id = node.id;
      }
    });

    // fire event when coding with editor
    var time_out ;
    editor.on("change", function () {
      if (time_out != null) {
        clearTimeout(time_out);
      } 
      time_out = setTimeout(function() {
        var text = editor.getValue();

        if (angular.element(
          document.getElementById("tree_1")
          ).jstree(true)._model.data[selected_file.id].original.content != text) {

          var data_change = {
            username: username,
            file_path: selected_file.path,
            content: text
          }

          angular.element(
            document.getElementById("tree_1")
          ).jstree(true)._model.data[selected_file.id].original.content = text;
          
          $http({
            method: "POST",
            url: '/playground',
            data: data_change,
            headers: { 'Content-Type': 'application/json'}
          }).then(function Success(res) {
            setTimeout(function(){
              angular.element(document.getElementById('result-iframe'))[0].contentWindow.location.reload();
            }, 500) //set timeout for reloading iframe
          }, function Error(res) {
            alert(res);
          });
        }
      }, 3000) // set timeout 2 second
    });

    //fire event create a file
    angular.element(document.getElementById('tree_1')).on('create_node.jstree', function(e, data) {
      console.log('saved');;
    });
    
    $scope.newFile = function() {
      if (selected_folder)
      {
        console.log(selected_folder);
        var nodeFolder = angular.element(document.getElementById(selected_folder.id + '_anchor'));
        var div_input = angular.element('<div class="input-group padding-top-bottom-5px margin-left-24px" id="div-input-newfile"><input type="text" class="form-control input-height"  id="input-newfile" ng-model="newfile" placeholder="new file"></input></div>');
        div_input.insertAfter(nodeFolder);
        var disable_input = document.addEventListener("mouseup", function(event) {
          div_input = document.getElementById("div-input-newfile");
          if (div_input && $(event.target).is("#input-newfile") == false) {
            div_input.remove();
          }
        });
      }
      // angular.element(document.getElementById('tree_1')).jstree(
      //   "create_node", selected_folder.id, { "text": "new.css", "type": "file-css"}, "last", function() {
      //     alert("done");
      //   });
    }
  });
}]);
