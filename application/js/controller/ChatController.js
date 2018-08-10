app.controller('chatCtl',['socket','$scope',function(socket,$scope) {
    console.log("chay qua day");
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