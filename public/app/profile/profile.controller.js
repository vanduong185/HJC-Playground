myApp.directive('fileModel', ['$parse', function($parse){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				})
			})
		}
	}
}]);
myApp.controller('ProfileController', ['$scope', '$state', '$http', '$rootScope','$cookieStore',
  function ($scope, $state, $http, $rootScope, $cookieStore ) {
    $rootScope.globals = $cookieStore.get('globals');
    $scope.email = $rootScope.globals.currentUserInfo.email;
    if($rootScope.globals.currentUserInfo.nickname!=null){
        $scope.nickname = $rootScope.globals.currentUserInfo.nickname
    }
    if($rootScope.globals.currentUserInfo.age!=null){
        $scope.age = $rootScope.globals.currentUserInfo.age;
    }
    if($rootScope.globals.currentUserInfo.jobtitle!=null){
        $scope.jobtitle = $rootScope.globals.currentUserInfo.jobtitle;
    }
    $scope.save = function(){
        if($scope.nickname!=$rootScope.globals.currentUserInfo.nickname
            ||$scope.age!=$rootScope.globals.currentUserInfo.age
            ||$scope.jobtitle!=$rootScope.globals.currentUserInfo.jobtitle){
                var infor = {
                    flag: "update_info",
					email: $scope.email,
					nickname: $scope.nickname,
                    jobtitle: $scope.jobtitle,
                    age: $scope.age,
                    id : $rootScope.globals.currentUserInfo.user_id
				}

				$http.post("users/profile", infor).then(function Success(res) {
                    console.log("haha");
                    console.log(res);
                    if(res.data.message=="Success"){
                        $rootScope.globals.currentUserInfo.nickname = infor.nickname ;
                        $rootScope.globals.currentUserInfo.age = infor.age;
                        $rootScope.globals.currentUserInfo.jobtitle = infor.jobtitle;
                        $cookieStore.remove("globals");
                        $cookieStore.put("globals", $rootScope.globals);
                        $state.reload($state.current);
                        toastr.success("Change successfully.");
                    }
                    else{
                        toastr.error(res.data.message);
                    }
				});
            }
    }

    $scope.changePass = function(){
        if(jQuery("#tab_1_3").hasClass("active")){
            // $scope.currentPass == $rootScope.globals.currentUserInfo.pass&&
            if($scope.currentPass!=null){
                if($scope.newPass!=null && $scope.rePass!=null){
                    if($scope.newPass==$scope.rePass){
                        var infor = {
                            flag: "change_pass",
                            email: $rootScope.globals.currentUserInfo.email,
                            currentPass: $scope.currentPass,
                            newPass:  $scope.newPass,
                            id : $rootScope.globals.currentUserInfo.user_id
                        }   
                        $http.post("users/profile", infor).then(function Success(res) {
                            console.log("haha");
                            console.log(res.data.message);
                            if(res.data.message=="Success"){
                                $rootScope.globals.currentUserInfo.password = res.data.data;
                                $cookieStore.remove("globals");
                                $cookieStore.put("globals", $rootScope.globals);
                                $state.reload($state.current);
                                toastr.success("Change successfully.");
                            }
                            else{
                                toastr.error(res.data.message);
                            }
                        });
                    }
                    else{
                        toastr.error("New password and re-type password are not same!")
                    }
                }
                else{
                    toastr.error("Please fill in new password and re-type password")
                }
            }
            else{
                toastr.error("Current password is incorrect!");
            }
        }
    }
    $scope.customer = {};
	$scope.Submit = function(){
        var data = $scope.customer;
        var fd = new FormData();
		for(var key in data)
            fd.append(key, data[key]);
            fd.append("id",$rootScope.globals.currentUserInfo.user_id);
		$http.post('users/profile', fd, {
			transformRequest: angular.indentity,
			headers: { 'Content-Type': undefined }
		}).then(function Success(res) {
            console.log("haha");
            console.log(res.data.message);
            if(res.data.message=="Success"){
                $rootScope.globals.currentUserInfo.avatar = res.data.data;
                $cookieStore.remove("globals");
                $cookieStore.put("globals", $rootScope.globals);
                $state.reload($state.current);
                toastr.success("Change successfully.");
            }
            else{
                $state.reload($state.current);
                toastr.error(res.data.message);
            }
        });
	}
  }
]);