var temp = {
    curent_conversation: "",
    skip: 0,
    take: 10
};

app.controller('chatCtl', ['socket', '$scope', 'communicate', function (socket, $scope, communicate) {
    if (window.sessionStorage.getItem('token') == null) {
        window.location = '/';
    }
    var pageStatus = {

    };
    $scope.cvs_name_disable = true;
    $scope.edit_cvs_name = true;
    $scope.type = false;
    $scope.disconected = false;
    $scope.tab = false;
    $scope.isEnd = false;
    var user = window.sessionStorage.getItem('user');
    var userId = window.sessionStorage.getItem('user_id')
    $scope.user = ' ~ ' + user;
    $scope.messages = [];
    $scope.conversations = [];
    $scope.isChatting = false;
    $scope.conversationName = "";
    $scope.lstContact = [];
    $scope.select = "";
    $scope.search = function () {
        // chua lam
    };

    $scope.loadConversation = function () {
        $scope.select = "Tất cả cuộc hội thoại";
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
        $scope.select = "Tất cả người dùng";
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
    //
    $scope.loadMember =function(){
        communicate.post(
            "/allmember",
            {
                cvsId : temp.curent_conversation
            },
            function (responseData) {
                $scope.lstMembers = responseData
            }, function (errorCode) {
                console.log(errorCode);
            });
        $scope.showMember = !$scope.showMember;
    }
    //
    //
    $scope.add = function(index){
        var element = $scope.lstContact[index];
        communicate.post(
            "/addmember",
            {
                cvsId : temp.curent_conversation,
                memberId :element.userId
            },
            function (responseData) {
                console.log(responseData);
                $scope.loadConversation();
            }, function (errorCode) {
                console.log(errorCode);
            });

        $scope.addMember();
    }
    $scope.addMember = function(){
        communicate.post(
            "/allfriend",
            {
                cvsId : temp.curent_conversation
            },
            function (responseData) {
                $scope.lstContact = responseData
            }, function (errorCode) {
                console.log(errorCode);
            });
        $scope.showContact = !$scope.showContact;
    }
    //
    $scope.loadChatHistory = function (cvsId, cvsName) {
        $scope.showContact = false;
        $scope.showMember = false;
        temp.skip = 0;
        $scope.isEnd = false;
        temp.curent_conversation = cvsId;
        // load 
        $scope.isChatting = true;
        $scope.conversationName = cvsName;
        $scope.messages = [];
        // getconversationcontent
        communicate.post(
            "/getconversationcontent/v2",
            {
                cvsId: cvsId,
                skip: 0,
                take: temp.take
            },
            function (responseData) {
                if(responseData.length < temp.take){
                    $scope.isEnd = true;
                    console.log("==================" + $scope.isEnd);
                }
                responseData.forEach(element => {
                    $scope.messages.unshift({
                        id: element.id,
                        isMe: element.userId == userId,
                        value: element.value,
                        time: element.time,
                        name: element.name
                    });
                    autoScroll();
                });

            }, function (errorCode) {
                console.log(errorCode);
            });
        $scope.conversations.forEach(ele => {
            if (ele.id == cvsId) {
                ele.numUnread = 0;
            }
        });

    }
    $scope.loadMore = function () {
        $scope.isEnd = false;
        // load more
        communicate.post(
            "/getconversationcontent/v2",
            {
                cvsId: temp.curent_conversation,
                skip: temp.skip + temp.take,
                take: temp.take
            },
            function (responseData) {
                $scope.isEnd = true;
                responseData.forEach(element => {
                    $scope.isEnd = false;
                    $scope.messages.unshift({
                        id: element.id,
                        isMe: element.userId == userId,
                        value: element.value,
                        time: element.time,
                        name: element.name
                    });

                });
                temp.skip = temp.skip + temp.take;
            }, function (errorCode) {
                console.log(errorCode);
            });
    }
    $scope.scrollTop = function () {
        console.log("top");
    }
    $scope.typing = function () {
        var msg = {
            msg_type: 2,
            to: temp.curent_conversation,
            value: ""
        };
        socket.send(JSON.stringify(msg));
    }
    $scope.save_name = function(){
        communicate.post(
            "/renameconversation",
            {
                cvsId: temp.curent_conversation,
                name: conversationName  
            },
            function (responseData) {
                edit_cvs_name = true;
                cvs_name_disable = true
                console.log(responseData);
            }, function (errorCode) {
                console.log(errorCode);
            });
    }
    
    var recMsg = function (msg) {
        console.log(msg);
        var msgObj = JSON.parse(msg);
        var msgType = msgObj.msg_type;
        if (msgType == 1) {
            var cvsId = msgObj.to;
            var msgElement = {
                isMe: msgObj.from == userId,
                value: msgObj.value,
                name: msgObj.name,
                time: 'now'
            };
            // tim 
            $scope.conversations.forEach(ele => {
                if (ele.id == cvsId) {
                    if (msgObj.from != userId){
                        ele.numUnread = ele.numUnread + 1;
                    }
                    ele.lastChat = msgObj.value;
                }
            });
            //
            $scope.messages.push(msgElement);
            $scope.$apply();
            autoScroll();
        } else if (msgType == 2) {
            $scope.type = true;
            $scope.$apply();
            var timer = setTimeout(function () {
                $scope.type = false;
                $scope.$apply();
                clearTimeout(timer);
            }, 8000);

        }
    };
    socket.addListener(recMsg);
    var closeSocket = function () {
        $scope.disconected = true;
        console.log("======================================= close");
        $('#myModal').modal('show');
        $scope.$apply();
        setTimeout(location.reload(), 5000);
        // location.reload();
    };
    socket.close(closeSocket);
    var autoScroll = function () {
        // auto scroll bottom
        console.log("auto scroll bottom");
        const messages = document.getElementById('chat_area');
        messages.scrollTop = messages.scrollHeight;
    }
}]);
