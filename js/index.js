var app = angular.module('app', []);

app.factory('socket', ['$q', function($q) {
    
    var Service = {};
    var ws = new WebSocket("ws://localhost:1997/user");
    var listeners = [];
    ws.onopen = function(){  
        console.log("Socket has been opened!");  
    };
    ws.onmessage = function(message) {
        console.log("begin recieve" + message.data);
        for (let index = 0; index < listeners.length; index++) {
            const element = listeners[index];
            element(message.data);
        }
        console.log("end recieve" + listeners.length);
    };
    function sendRequest(request) {
      console.log('Sending request', request);
      ws.send(request);
    };

    Service.send = function(text) { 
        return sendRequest(text);
    };
    Service.addListener = function(listener){
        listeners.push(listener);
    };

    return Service;
}])
app.controller('leftBarCtl',['socket','$scope',function(socket,$scope) {
    $scope.text1 = "eee";
    console.log("chay qua day");
    socket.addListener(function(aaa){
        console.log("===================================");
        console.log(aaa);
        $scope.text1 = "eee";
        $scope.text1 = aaa;
    });
    $scope.search = function(){
        socket.send($scope.text);
    };

}]);

app.controller('contentCtl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});