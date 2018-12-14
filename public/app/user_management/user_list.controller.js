myApp.controller('UserListController', ['users_data', 'UserAPI', '$rootScope', '$scope', '$state', '$http', '$ngBootbox', '$uibModal',
  function (users_data, UserAPI, $rootScope, $scope, $state, $http, $ngBootbox, $uibModal) {
    $scope.users = users_data.data.users;

    $scope.keyword = null;

    $scope.options = {
      keyword: $scope.keyword,
      paginate: {
        page: 1
      }
    }

    $scope.pageChange = function () {
      UserAPI.get_users({
        options: $scope.options
      }).then(function (response) {
        $scope.users = response.data.users
      })
    }

    $scope.searchUser = function() {
      $scope.options.keyword = $scope.keyword;
      UserAPI.get_users({
        options: $scope.options
      }).then(function (response) {
        $scope.users = response.data.users
      })
    }

    $scope.addUser = function() {
      $uibModal.open({
        templateUrl: "views/users/create.html",
        controller: "User_CreateController"
      })
    }

    $scope.showDeleteModal = function (user_id) {
      $ngBootbox.confirm('Are you sure delete this user?').then(function () {
        UserAPI.delete_user(user_id).success(function (response) {
          if (response.message == 'deleted') {
            $state.reload($state.current);
            toastr.success("Deleted sucessfully !");
          } else {
            toastr.error("Something went wrong !");
          }
        });
      });
    }
}])
