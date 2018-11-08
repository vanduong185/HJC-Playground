myApp.directive('fileInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
           var model = $parse(attrs.fileinput);
           var modelSetter = model.assign;
           
           element.bind('change', function() {
              scope.$apply(function() {
                 modelSetter(scope, element[0].files[0]);
              });
           });
        }
     };
 }]).
controller('ProfileController', ['$scope', '$state', '$http', '$rootScope','$cookieStore',
  function ($scope, $state, $http, $rootScope, $cookieStore ) {
    // localStorage.setItem("aaa", $rootScope.globals.currentUserInfo);
    // console.log(localStorage.getItem("aaa").age);
    // console.log($rootScope.globals.currentUserInfo.age);
    $rootScope.globals = $cookieStore.get('globals');
    // console.log($cookieStore.get('globals').currentUserInfo.age);
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
                    id : $scope.id
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
                            id : $scope.id
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
    $scope.filesChanged = function(elm){
        $scope.files = elm.files
        $scope.$apply();
    }
    $scope.updateAva = function(){
        var fd = new FormData()
        angular.forEach($scope.files,function(file){
            fd.append('file',file)
        })
        $http.post("users/profile",fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(console.log("upload")).error(console.log("err"));
    }
    // $scope.uploadFile = function(files) {
    //     var fd = new FormData();
    //     //Take the first selected file
    //     fd.append("file", files[0]);
    
    //     $http.post("users/profile", fd, {
    //         withCredentials: true,
    //         headers: {'Content-Type': undefined },
    //         transformRequest: angular.identity
    //     }).success(console.log("upload")).error(console.log("err"));
    
    // };
    // $scope.updateAva = function(){
    //     var fd = new FormData();
    
    //     fd.append("file", files);

    //     var infor = {
    //         flag: "avatar",
    //         email: $rootScope.globals.currentUserInfo.email,
    //         picture: fd
    //     }
    //     $http.post("users/profile", $scope.picture, {
    //         headers: {
    //             'Content-Type': mutipart/form-data
    //         }
    //     }).success(console.log("upload")).error(console.log("err"));
    //     // $http.post("users/profile", infor, function (res) {
    //     //     console.log("haha")
    //     //     console.log(res);
    //     //     if(res=="Success"){
    //     //     }
    //     //     if(res == "Error"){
    //     //     }
    //     //     location.reload();
    //     // });
    // }
  }
]);