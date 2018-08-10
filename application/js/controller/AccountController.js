app.controller('accountCtl', ['$scope','$http','communicate','md5', function ($scope,$http,communicate,md5) {
    $scope.tabflag = false;
    $scope.tab = function (tab) {
        if (tab == 1) {
            $scope.tabflag = false;
        } else if (tab == 2) {
            $scope.tabflag = true;
        }
    };

    $scope.login = function () {
        communicate.post(
            "/login",
            {
                email : $scope.email,
                passwordMd5 : md5.createHash($scope.password)
            },
            function(responseData){
                console.log(responseData);
            },function(errorCode){
                console.log(errorCode);
            });
    };
    $scope.register = function () {

    };
}]);