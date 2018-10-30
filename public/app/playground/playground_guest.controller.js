myApp.controller('Playground_GuestController', ['guest_project_data', 'libraries_data', 'GuestProject', '$rootScope', '$scope', '$state', '$http', '$timeout',
  function (guest_project_data, libraries_data, GuestProject, $rootScope, $scope, $state, $http, $timeout) {
    
    //manage libraries
    $scope.libraries = libraries_data.results.slice(0, 10);
    $scope.keyword = "";
    $scope.searchLibrary = function () {
      GuestProject.searchLibraries($scope.keyword).then(function (res) {
        $timeout(function () {
          $scope.libraries = res.results.slice(0, 10);
        }, 100);
      })
    }

    var guest_project = guest_project_data.data.guest_project;
    var data = guest_project_data.data.data;
    data.text = "guest";

    // initialize editor with CodeMirror plugin
    var editor = CodeMirror(document.getElementById("codeeditor"), {
      mode: "html",
      theme: "neat",
      tabSize: 2,
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      extraKeys: { "Ctrl-Space": "autocomplete" }
    });

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
    angular.element(document.getElementById('result-iframe'))[0].src = '../data/guest/' + guest_project + '/index.html';

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

    // fire event when coding with editor
    var time_out;
    editor.on("change", function () {
      if (time_out != null) {
        clearTimeout(time_out);
      }
      time_out = setTimeout(function () {
        var text = editor.getValue();
        if (angular.element(document.getElementById("tree_1")).jstree(true)._model.data[selected_file.id]) {
          if (angular.element(
            document.getElementById("tree_1")
          ).jstree(true)._model.data[selected_file.id].original.content != text) {

            var data_change = {
              user_id: "guest",
              flag: "change",
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
              headers: { 'Content-Type': 'application/json' }
            }).then(function Success(res) {
              setTimeout(function () {
                angular.element(document.getElementById('result-iframe'))[0].contentWindow.location.reload();
              }, 500) //set timeout for reloading iframe
            }, function Error(res) {
            });
          }
        }
      }, 3000) // set timeout 2 second
    });

    // fire event new file
    $scope.newFile = function () {
      if (selected_folder) {
        nodeFolder = angular.element(document.getElementById(selected_folder.id + '_anchor'));
        div_input = angular.element('<div class="input-group padding-top-bottom-5px margin-left-24px" id="div-input-newfile"><input type="text" class="form-control input-height" id="input-newfile" ng-model="newfile" placeholder="new file"></div>');
        div_input.insertAfter(nodeFolder);
        input = document.getElementById("input-newfile");
        document.addEventListener("mouseup", function (event) {
          div_input = document.getElementById("div-input-newfile");
          if (div_input && $(event.target).is("#input-newfile") == false) {
            div_input.remove();
          }
        });

        input.addEventListener("keypress", function (e) {
          if (e.keyCode === 13) {
            var filename = input.value;
            var filetype = null;
            if (filename.includes(".html")) {
              filetype = "file-html";
            }
            else if (filename.includes(".css")) {
              filetype = "file-css";
            }
            else if (filename.includes(".js")) {
              filetype = "file-js";
            }
            else {
              filetype = "file";
            }
            angular.element(document.getElementById('tree_1')).jstree(
              "create_node", selected_folder.id, { "text": filename, "type": filetype, content: " ", path: selected_folder.path + "/" + filename }, "last", function () {
                var new_file = {
                  user_id: "guest",
                  flag: "create file",
                  file_path: selected_folder.path + "/" + filename,
                  filename: filename,
                  content: " "
                }
                $http({
                  method: "POST",
                  url: '/playground',
                  data: new_file,
                  headers: { 'Content-Type': 'application/json' }
                }).then(function Success(res) {
                })
              });
          }
        });
      }
    }

    // fire event new folder
    $scope.newFolder = function () {
      if (selected_folder) {
        nodeFolder = angular.element(document.getElementById(selected_folder.id + '_anchor'));
        div_input = angular.element('<div class="input-group padding-top-bottom-5px margin-left-24px" id="div-input-newfolder"><input type="text" class="form-control input-height" id="input-newfolder" placeholder="new folder"></div>');
        div_input.insertAfter(nodeFolder);
        input = document.getElementById("input-newfolder");
        document.addEventListener("mouseup", function (event) {
          div_input = document.getElementById("div-input-newfolder");
          if (div_input && $(event.target).is("#input-newfolder") == false) {
            div_input.remove();
          }
        });
        input.addEventListener("keypress", function (e) {
          if (e.keyCode === 13) {
            foldername = input.value;
            angular.element(document.getElementById('tree_1')).jstree(
              "create_node", selected_folder.id, { "text": foldername, "type": "folder", path: selected_folder.path + "/" + foldername }, "last", function () {
                var new_folder = {
                  user_id: "guest",
                  flag: "create folder",
                  file_path: selected_folder.path + "/" + foldername,
                  foldername: foldername
                }
                $http({
                  method: "POST",
                  url: '/playground',
                  data: new_folder,
                  headers: { 'Content-Type': 'application/json' }
                }).then(function Success(res) {
                })
              });
          }
        });
      }
    }

    //fire event delete a file or a folder
    angular.element(document.getElementById('tree_1')).on('delete_node.jstree', function (e, data) {
      node = data.node;
      if (node.original.type == "folder") {
        delete_folder = {
          user_id: "guest",
          flag: "delete folder",
          file_path: node.original.path
        };
        $http({
          method: "POST",
          url: '/playground',
          data: delete_folder,
          headers: { 'Content-Type': 'application/json' }
        }).then(function Success(res) {
          setTimeout(function () {
            angular.element(document.getElementById('result-iframe'))[0].contentWindow.location.reload();
          }, 500) //set timeout for reloading iframe
        })
      }
      else {
        delete_file = {
          user_id: "guest",
          flag: "delete file",
          file_path: node.original.path
        };
        $http({
          method: "POST",
          url: '/playground',
          data: delete_file,
          headers: { 'Content-Type': 'application/json' }
        }).then(function Success(res) {
          setTimeout(function () {
            angular.element(document.getElementById('result-iframe'))[0].contentWindow.location.reload();
          }, 500) //set timeout for reloading iframe
        })
      }
    });

    $scope.delete = function () {
      if (selected_folder) {
        angular.element(document.getElementById('tree_1')).jstree("delete_node", selected_folder.id);
      }
      else {
        angular.element(document.getElementById('tree_1')).jstree("delete_node", selected_file.id);
      }
    }

    //fire event rename a file or a folder
    $scope.rename = function () {
      if (selected_folder) {
        nodeFolder = angular.element(document.getElementById(selected_folder.id + "_anchor"));
        div_input = angular.element('<div class="input-group padding-top-bottom-5px margin-left-24px" id="div-input-rename"><input type="text" class="form-control input-height" id="input-rename"></div>');
        div_input.insertAfter(nodeFolder);
        input = document.getElementById("input-rename");
        input.value = nodeFolder[0].textContent;
        document.addEventListener("mouseup", function (event) {
          div_input = document.getElementById("div-input-rename");
          if (div_input && $(event.target).is("#input-rename") == false) {
            div_input.remove();
          }
        });
        input.addEventListener("keypress", function (e) {
          if (e.keyCode === 13) {
            foldername = input.value;
            node = angular.element(
              document.getElementById("tree_1")
            ).jstree(true)._model.data[selected_folder.id];
            node.original.text = foldername;
            path = node.original.path;
            arr = path.split("/");
            arr[arr.length - 1] = foldername;
            node.original.path = arr.join("/");
            angular.element(document.getElementById('tree_1')).jstree("rename_node", selected_folder.id, foldername);
          }
        });
      }
      else {
        nodeFile = angular.element(document.getElementById(selected_file.id + "_anchor"));
        div_input = angular.element('<div class="input-group padding-top-bottom-5px margin-left-24px" id="div-input-rename"><input type="text" class="form-control input-height" id="input-rename"></div>');
        div_input.insertAfter(nodeFile);
        input = document.getElementById("input-rename");
        input.value = nodeFile[0].textContent;
        document.addEventListener("mouseup", function (event) {
          div_input = document.getElementById("div-input-rename");
          if (div_input && $(event.target).is("#input-rename") == false) {
            div_input.remove();
          }
        });
        input.addEventListener("keypress", function (e) {
          if (e.keyCode === 13) {
            filename = input.value;
            filetype = null;
            if (filename.includes(".html")) {
              filetype = "file-html";
              editor.setOption("mode", "htmlmixed");
            }
            else if (filename.includes(".css")) {
              filetype = "file-css";
              editor.setOption("mode", "css");
            }
            else if (filename.includes(".js")) {
              filetype = "file-js";
              editor.setOption("mode", "javascript");
            }
            else {
              filetype = "file";
              editor.setOption("mode", "text/plain");
            }
            node = angular.element(
              document.getElementById("tree_1")
            ).jstree(true)._model.data[selected_file.id];
            node.original.type = filetype;
            node.original.text = filename;
            path = node.original.path;
            arr = path.split("/");
            arr[arr.length - 1] = filename;
            node.original.path = arr.join("/");
            angular.element(
              document.getElementById("tree_1")
            ).jstree(true).set_type(selected_file.id, filetype);
            angular.element(document.getElementById('tree_1')).jstree("rename_node", selected_file.id, filename);
          }
        });
      }
    }

    angular.element(document.getElementById('tree_1')).on('rename_node.jstree', function (e, data) {
      node = data.node;
      arr = node.original.path.split("/");
      arr[arr.length - 1] = data.old;
      old_path = arr.join("/");
      if (node.original.type == "folder") {
        rename_folder = {
          user_id: "guest",
          flag: "rename folder",
          new_path: node.original.path,
          old_path: old_path
        };
        $http({
          method: "POST",
          url: '/playground',
          data: rename_folder,
          headers: { 'Content-Type': 'application/json' }
        }).then(function Success(res) {
          setTimeout(function () {
            angular.element(document.getElementById('result-iframe'))[0].contentWindow.location.reload();
          }, 500) //set timeout for reloading iframe
        })
      }
      else {
        rename_file = {
          user_id: "guest",
          flag: "rename file",
          new_path: node.original.path,
          old_path: old_path
        };
        $http({
          method: "POST",
          url: '/playground',
          data: rename_file,
          headers: { 'Content-Type': 'application/json' }
        }).then(function Success(res) {
          setTimeout(function () {
            angular.element(document.getElementById('result-iframe'))[0].contentWindow.location.reload();
          }, 500) //set timeout for reloading iframe
        })
      }
    });
  }
]);
