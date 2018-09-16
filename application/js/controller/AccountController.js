app.controller('accountCtl', ['$scope', 'communicate', 'md5', function ($scope, communicate, md5) {
    $scope.alert = false;
    $scope.tabflag = false;
    if(window.sessionStorage.getItem('token') != null){
        window.location = '/#!/chat';
    }
    $scope.tab = function (tab) {
        $scope.alert = false;
        if (tab == 1) {
            $scope.tabflag = false;
        } else if (tab == 2) {
            $scope.tabflag = true;
        }
    };

    $scope.login = function () {
        $scope.alert = true;
        communicate.post(
            "/login",
            {
                email: $scope.email,
                passwordMd5: md5.createHash($scope.password)
            },
            function (responseData) {
                alertMsg('success', 'OK');
                window.sessionStorage.setItem('token',responseData.token);
                window.sessionStorage.setItem('user',responseData.email);
                window.sessionStorage.setItem('user_id',responseData.userId);
                window.sessionStorage.setItem('name',responseData.name);
                window.sessionStorage.setItem('avatar',hostImg + responseData.avatar);
                window.location = '/#!/chat';
            }, function (errorCode) {
                alertMsg('danger', 'Incorrect email or password');
                console.log(errorCode);
            });
    };

    $scope.register = function () {
        $scope.alert = true;
        communicate.post(
            "/register",
            {
                name: $scope.name,
                email: $scope.emailReg,
                password: $scope.passwordReg
            },
            function (responseData) {
                alertMsg('success', 'OK');
                window.sessionStorage.setItem('token',responseData.token);
                window.sessionStorage.setItem('user',responseData.email);
                window.sessionStorage.setItem('user_id',responseData.userId);
                window.sessionStorage.setItem('name',responseData.name);
                window.sessionStorage.setItem('avatar',hostImg + responseData.avatar);
                window.location = '/#!/chat';
            }, function (errorCode) {
                if (errorCode == -1)
                    alertMsg('danger', 'Incorrect email or password.');
                if (errorCode == 1)
                    alertMsg('danger', 'Server error.');
                if (errorCode == 3)
                    alertMsg('danger', 'Email exist.');
            });
    };

    $scope.confirm = function () {
        $scope.alert = false;
        if($scope.passwordReg != $scope.passwordCfr){
            alertMsg('danger', 'Repeat password');
            $scope.alert = true;
        }
    };
    var alertMsg = function (type, msg) { 
        $scope.type = type;
        $scope.msg = msg;
    };
}]);