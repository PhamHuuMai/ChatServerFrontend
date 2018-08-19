var temp = {
    curent_conversation: ""

};

app.controller('chatCtl', ['socket', '$scope', 'communicate', function (socket, $scope, communicate) {
    if (window.sessionStorage.getItem('token') == null) {
        window.location = '/';
    }
    $scope.tab = false;
    var user = window.sessionStorage.getItem('user');
    var userId = window.sessionStorage.getItem('user_id')
    $scope.user = ' ~ ' + user;
    $scope.messages = [];
    $scope.isChatting = false;
    $scope.conversationName = "";

    $scope.select = "";
    $scope.search = function () {
        // chua lam
    };

    $scope.loadConversation = function () {
        $scope.select = "All Conversation";
        $scope.contactTab = false;
        $scope.conversationTab = true;
        $scope.conversations = [];
        communicate.post(
            "/getallconversation",
            {},
            function (responseData) {
                responseData.forEach(element => {
                    $scope.conversations.push({
                        id: element.id,
                        name: element.name,
                        lastChat: element.lastChat,
                        numUnread: element.numUnread,
                        lastTimeAction: element.lastTimeAction
                    });
                });
            }, function (errorCode) {
                console.log(errorCode);
            });
    }
    $scope.loadAllContact = function () {
        $scope.select = "All Contact";
        $scope.contactTab = true;
        $scope.conversationTab = false;

        communicate.post(
            "/getAllUser",
            {},
            function (responseData) {
                $scope.contact = [];
                responseData.forEach(element => {
                    $scope.contact.push({
                        id: element.userId,
                        name: element.userName,
                        time: element.lastLoginTIme
                    });
                });
            }, function (errorCode) {
                console.log(errorCode);
            });
    }
    $scope.connect = function (id) {
        $scope.select = "All Contact";
        communicate.post(
            "/addconversation",
            {
                memberId: id
            },
            function (responseData) {
                $scope.loadConversation();
            }, function (errorCode) {
                console.log(errorCode);
            });

    }
    $scope.send = function () {
        var msg = {
            msg_type: 1,
            to: temp.curent_conversation,
            value: $scope.message
        };
        socket.send(JSON.stringify(msg));
        $scope.message = "";
    }

    $scope.loadChatHistory = function (cvsId, cvsName) {
        temp.curent_conversation = cvsId;
        // load 
        $scope.isChatting = true;
        $scope.conversationName = cvsName;
        $scope.messages = [];
        // getconversationcontent
        communicate.post(
            "/getconversationcontent",
            {
                cvsId: cvsId
            },
            function (responseData) {
                responseData.forEach(element => {
                    $scope.messages.push({
                        id: element.id,
                        isMe: element.userId == userId,
                        value: element.value,
                        time: element.time
                    });
                });
            }, function (errorCode) {
                console.log(errorCode);
            });
        $scope.conversations.forEach(ele => {
            if (ele.id == cvsId) {
                ele.numUnread = 0;
            }
        });
        autoScroll();
    }
    var recMsg = function (msg) {
        var msgObj = JSON.parse(msg);
        var cvsId = msgObj.to;
        var msgElement = {
            isMe: msgObj.from == userId,
            value: msgObj.value

        };
        // tim 
        $scope.conversations.forEach(ele => {
            if (ele.id == cvsId && msgObj.from != userId) {
                ele.numUnread = ele.numUnread + 1;
            }
        });

        //
        $scope.messages.push(msgElement);
        $scope.$apply();
        autoScroll();
    };
    socket.addListener(recMsg);

}]);
var autoScroll = function () {
    // auto scroll bottom
    console.log("auto scroll bottom");
    const messages = document.getElementById('chat_area');
    messages.scrollTop = messages.scrollHeight;
}