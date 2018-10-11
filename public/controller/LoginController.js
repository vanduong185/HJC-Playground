// myApp.controller('LoginController', ['$scope', '$http', '$uibModal' function($scope, $http, $uibModal) {
//   $scope.show = function() {
//     $uibModal.open({
//       template: 'views/login.html',
//       controller: "ModalController"
//     }).then(function(modal) {
//       modal.element.modal();
//       modal.close.then(function(result) {
//         $scope.message = "You said " + result;
//       });
//     });
//   };

// });
// app.controller('ModalController', function($scope, close) {

//   $scope.close = function(result) {
//     close(result, 500); // close, but give 500ms for bootstrap to animate
//   };

// });
// var myApp = angular.module('demoApp', ['ui.router', 'ui.bootstrap']);

// myApp.controller("IndexController", ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {
//   $scope.login = function () {
//     $uibModal.open({
//       templateUrl: 'views/login.html',
//       controller: function ($scope, $uibModalInstance) {
//         $scope.submit = function () {
//           if($scope.username == 'admin' && $scope.password == 'admin'){
//             $uibModalInstance.close();
//           }
//           else{
//             alert('Wrong Stuff');
//           }
//         };
      
//         // $scope.cancel = function () {
//         //   $uibModalInstance.dismiss('cancel');
//         // };
//       }
//     })
//   }
// }])