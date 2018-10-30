myApp.controller('SignUpController', ['$location','$scope', '$state', '$http','Auth',
  function ($location,$scope, $state, $http, Auth) {
	    $('#pass').hide() ;
		$scope.register = function(){	
			if($scope.password === $scope.rpassword){
				var infor = {
					email : $scope.email,
					nickname : $scope.nickname,
					password : $scope.password
				}

				$http.post("/users/signup", infor, function(res) {
					console.log(res);
				});
				$location.path("/home") ;
				Auth.showLoginModal();	
			}					
			else{
				$("#pass").toggle();
			}
		};
// 	$(".register-form input").keypress(function (e) { return 13 == e.which ? ($(".register-form").validate().form() && $(".register-form").submit(), !1) : void 0 }),
// 	jQuery("#register-btn").click(function () {
// 		jQuery(".login-form").hide()
// 	})
// jQuery("#register-back-btn").click(function () {

// 		jQuery(".login-form").show()
// })
   }
]);

