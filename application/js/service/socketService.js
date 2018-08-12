app.factory('socket', ['$q', function($q) {
    // https://chatserver-maiph.herokuapp.com/
    var Service = {};
    var ws = new WebSocket("ws://chatserver-maiph.herokuapp.com/chat");
    var listeners = [];
    ws.onopen = function(){  
        console.log("Socket has been opened!");  
    };
    ws.onmessage = function(message) {
        console.log("begin recieve" + message.data);
        for (let index = 0; index < listeners.length; index++) {
            var element = listeners[index];
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