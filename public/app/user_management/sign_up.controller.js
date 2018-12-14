myApp.controller('SignUpController', ['UserAPI', '$location', '$scope', '$state', '$http', 'Auth',
	function (UserAPI, $location, $scope, $state, $http, Auth) {
		$('#pass').hide();
		$scope.register = function () {
			if ($scope.password === $scope.rpassword) {
				var infor = {
					email: $scope.email,
					nickname: $scope.nickname,
					password: $scope.password
				}

				$http.post("/users/signup", infor, function (res) {
					console.log(res);
				});
				$location.path("/home");
				Auth.showLoginModal();
			}
			else {
				$("#pass").toggle();
			}
		};
	}
]);

