app.factory('socket', ['$q', function($q) {
    // https://chatserver-maiph.herokuapp.com/
    var Service = {};
    Service.state = 0;
    ws = new WebSocket(socketChatHost);
    var listeners = [];
    ws.onopen = function(){
        Service.state = 1;  
        console.log("Socket has been opened!");
        var authen = {
            msg_type : 0,
            token : window.sessionStorage.getItem('token')
        };
        ws.send(JSON.stringify(authen));
    };
    ws.onmessage = function(message) {
        console.log("begin recieve" + message.data);
        for (let index = 0; index < listeners.length; index++) {
            var element = listeners[index];
            element(message.data);
        }
        console.log("end recieve" + listeners.length);
    };
    ws.onclose = function(message) {
        console.log("close");
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