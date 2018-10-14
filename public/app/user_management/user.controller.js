angular.module('app').controller('UserController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
  $http.get('/users').success(function(response) {
    console.log("got response");
    $scope.listPerson = response;
  });
}]);
