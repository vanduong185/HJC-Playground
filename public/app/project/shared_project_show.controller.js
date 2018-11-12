myApp.controller('SharedProject_ShowController', ['shared_project_data', 'ProjectAPI', '$rootScope', '$scope', '$state', '$http', '$timeout',
  function (shared_project_data, ProjectAPI, $rootScope, $scope, $state, $http, $timeout) {

    var shared_project = shared_project_data.data.shared_project;
    var data = shared_project_data.data.data;

    $scope.shared_project = shared_project;

    data.state = { opened: true };

    // initialize treeview with jsTree plugin  
    var tree = angular.element(document.getElementById("tree_1")).jstree({
      'core': {
        'check_callback': true,
        'theme': {
          'responsive': false
        },
        'data': data
      },
      'types': {
        'default': { icon: "fa fa-folder gray icon-lg" },
        'file': { icon: "fa fa-file icon-state-warning icon-lg" },
        'file-html': { icon: "fa fa-html5 orange icon-lg" },
        'file-css': { icon: "fa fa-css3 blue icon-lg" },
        'file-js': { icon: "fa fa-code red icon-lg" }
      },
      'plugins': ['types']
    })

    // initialize editor with CodeMirror plugin
    var editor = CodeMirror(document.getElementById("codeeditor"), {
      mode: "htmlmixed",
      theme: "neat",
      readOnly: true,
      tabSize: 2,
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      extraKeys: { "Ctrl-Space": "autocomplete" }
    });

    // initialize result iframe
    window.addEventListener("message", function (e) {
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
      document.getElementById("console").appendChild(log);
    })
    angular.element(document.getElementById('result-iframe'))[0].src = '../data/' + shared_project.author_id + '/' + shared_project.project_name + '/index.html';

    $scope.clearConsole = function () {
      document.getElementById("console").textContent = "";
    }

    // fire event when select file or folder on tree view, set code of file for editor 
    var selected_file = {};
    var selected_folder = {};
    angular.element(document.getElementById('tree_1')).on('select_node.jstree', function (e, data) {
      var node = data.node;
      if (node.original.type != "folder") {
        switch (node.original.type) {
          case "file-html": {
            editor.setOption("mode", "htmlmixed");
            break;
          }
          case "file-css": {
            editor.setOption("mode", "css");
            break;
          }
          case "file-js": {
            editor.setOption("mode", "javascript");
            break;
          }
          case "file": {
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
  }
]);
