app.controller('chatCtl',['socket','$scope',function(socket,$scope) {
    if(window.sessionStorage.getItem('token') == null){
        window.location = '/';
    }
    var user = window.sessionStorage.getItem('user')
    $scope.user = ' ~ '+user;
    console.log($scope.user);
    socket.addListener(function(aaa){
        console.log("===================================");
        console.log(aaa);
        $scope.text1 = aaa;
    });
    $scope.search = function(){
        socket.send($scope.text);
    };
    
    $scope.loadConversation = function(){
        
    }

}]);