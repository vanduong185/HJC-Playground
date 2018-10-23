myApp.controller('SignUpController', ['$location','$scope', '$state', '$http','Auth',
  function ($location,$scope, $state, $http, Auth) {
		$scope.register = function(){		
				$location.path("\home") ;
				Auth.showLoginModal();			
		}
		jQuery("#register-back-btn").click(function () {
			$location.path("\home");
		})
// 	$(".register-form input").keypress(function (e) { return 13 == e.which ? ($(".register-form").validate().form() && $(".register-form").submit(), !1) : void 0 }),
// 	jQuery("#register-btn").click(function () {
// 		jQuery(".login-form").hide()
// 	})
// jQuery("#register-back-btn").click(function () {

// 		jQuery(".login-form").show()
// })
   }
]);

