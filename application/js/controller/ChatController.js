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
    $scope.editName = true;
    $scope.cvs_name_disable = true;
    $scope.edit_cvs_name = true;
    $scope.type = false;
    $scope.disconected = false;
    $scope.tab = false;
    $scope.isEnd = false;
    $scope.eventInputShow = false;
    var user = window.sessionStorage.getItem('user');
    var name = window.sessionStorage.getItem('name');
    var userId = window.sessionStorage.getItem('user_id')
    $scope.curAvatar = window.sessionStorage.getItem('avatar')
    $scope.user = user;
    $scope.name = name;
    $scope.messages = [];
    $scope.conversations = [];
    $scope.searchResult = [];
    $scope.isChatting = false;
    $scope.search1 = false;
    $scope.conversationName = "";
    $scope.lstContact = [];
    $scope.select = "";
    $scope.events = [{}];
    $scope.files = [];
    //
    $scope.logout = function () {
        sessionStorage.clear();
        window.location = '/';
        console.log("logout");
    }
    $scope.search = function () {
        $scope.search1 = true;
        communicate.post(
            "/searchUser",
            {
                text: $scope.text
            },
            function (responseData) {
                $scope.searchResult = [];
                $scope.statusSearch = "Không có kết quả tìm kiếm.";
                responseData.forEach(element => {
                    $scope.statusSearch = "";
                    $scope.searchResult.push({
                        id: element.userId,
                        name: element.userName,
                        avatar: hostImg + element.avatar,
                        time: element.lastLoginTIme
                    });
                });
            }, function (errorCode) {
                console.log(errorCode);
            });
        console.log("search");
    }
    $scope.cancel = function () {
        $scope.search1 = false;
        $scope.text = "";
    }
    $scope.editNameClk = function () {
        $scope.editName = false;
    }
    $scope.save = function () {
        $scope.editName = true;
        // call api
        communicate.post(
            "/rename",
            {
                newName: $scope.name
            },
            function (responseData) {
                window.sessionStorage.setItem('name', $scope.name);
            }, function (errorCode) {
                console.log(errorCode);
            });
        //
    }
    //
    // $scope.upload = function(){
    //     document.getElementById('avatar').src = $scope.avatar;
    //     console.log($scope.avatar);
    // }
    $scope.$watch("avatar", function (newValue, oldValue) {
        if (newValue != oldValue) {
            var arr = newValue.split(",");
            communicate.post(
                "/uploadavatar",
                {
                    mimeType: arr[0],
                    fileName: arr[1],
                    file: arr[2]
                },
                function (responseData) {
                    $scope.curAvatar = hostImg + responseData.url;
                    document.getElementById('avatar').src = hostImg + responseData.url;
                }, function (errorCode) {
                    document.getElementById('avatar').src = oldValue;
                });
        }
    }, true);

    $scope.loadConversation = function () {
        $scope.select = "Tất cả cuộc hội thoại";
        $scope.contactTab = false;
        $scope.conversationTab = true;
        $scope.userTab = false;
        $scope.requestTab = false;
        $scope.conversations = [];
        communicate.post(
            "/getallconversation",
            {},
            function (responseData) {
                $scope.conversations = [];
                responseData.forEach(element => {
                    $scope.conversations.push({
                        id: element.id,
                        name: element.name,
                        lastChat: element.lastChat,
                        avatar: hostImg + element.avatar,
                        numUnread: element.numUnread,
                        lastTimeAction: element.lastTimeAction
                    });
                });
            }, function (errorCode) {
                console.log(errorCode);
            });
    };
    $scope.loadAllContact = function () {
        $scope.select = "Tất cả liên lạc";
        $scope.contactTab = true;
        $scope.conversationTab = false;
        $scope.userTab = false;
        $scope.requestTab = false;
        communicate.post(
            "/getAllFriend",
            {},
            function (responseData) {
                $scope.contact = [];
                responseData.forEach(element => {
                    $scope.contact.push({
                        id: element.userId,
                        name: element.userName,
                        avatar: hostImg + element.avatar,
                        time: element.lastLoginTIme
                    });
                });
            }, function (errorCode) {
                console.log(errorCode);
            });
    };
    $scope.loadAllUser = function () {
        $scope.select = "Tất cả người dùng";
        $scope.contactTab = false;
        $scope.conversationTab = false;
        $scope.userTab = true;
        $scope.requestTab = false;
        communicate.post(
            "/getAllUser",
            {},
            function (responseData) {
                $scope.users = [];
                responseData.forEach(element => {
                    $scope.users.push({
                        id: element.userId,
                        name: element.userName,
                        avatar: hostImg + element.avatar,
                        time: element.lastLoginTIme
                    });
                });
            }, function (errorCode) {
                console.log(errorCode);
            });
    };
    $scope.loadAllRequest = function () {
        $scope.select = "Yêu cầu kết bạn";
        $scope.contactTab = false;
        $scope.conversationTab = false;
        $scope.userTab = false;
        $scope.requestTab = true;
        communicate.post(
            "/getAllRequestedFriend",
            {},
            function (responseData) {
                $scope.requests = [];
                responseData.forEach(element => {
                    $scope.requests.push({
                        id: element.userId,
                        name: element.userName,
                        avatar: hostImg + element.avatar,
                        time: element.lastLoginTIme
                    });
                });
            }, function (errorCode) {
                console.log(errorCode);
            });
    };

    $scope.connect = function (id) {
        $scope.select = "All Contact";
        communicate.post(
            "/addconversation",
            {
                memberId: id
            },
            function (responseData) {
                $scope.conversations = [];
                $scope.loadConversation();
            }, function (errorCode) {
                console.log(errorCode);
            });

    };
    $scope.send = function () {
        var msg = {
            msg_type: 1,
            to: temp.curent_conversation,
            value: $scope.message
        };
        socket.send(JSON.stringify(msg));
        $scope.message = "";
    };
    $scope.addFriend = function (id) {
        communicate.post(
            "/requestfriend",
            {
                friendId: id
            },
            function (responseData) {
                alert("Send request successfull");
            }, function (errorCode) {
                console.log(errorCode);
            });
    };
    $scope.reject = function (id) {
        communicate.post(
            "/rejectfriend",
            {
                friendId: id
            },
            function (responseData) {
                $scope.loadAllContact();
                alert("Reject successfull");
            }, function (errorCode) {
                console.log(errorCode);
            });
    };
    $scope.deny = function (id) {
        communicate.post(
            "/denyfriend",
            {
                friendId: id
            },
            function (responseData) {
                $scope.loadAllRequest();
                alert("Deny successfull");
            }, function (errorCode) {
                console.log(errorCode);
            });
    };
    $scope.accept = function (id) {
        communicate.post(
            "/acceptfriend",
            {
                friendId: id
            },
            function (responseData) {
                $scope.loadAllRequest
                alert("Acept successfull");
            }, function (errorCode) {
                console.log(errorCode);
            });
    };
    //
    $scope.loadMember = function () {
        communicate.post(
            "/allmember",
            {
                cvsId: temp.curent_conversation
            },
            function (responseData) {
                $scope.lstMembers = responseData
            }, function (errorCode) {
                console.log(errorCode);
            });
        $scope.showMember = !$scope.showMember;
    };
    //
    $scope.add = function (index) {
        var element = $scope.lstContact[index];
        communicate.post(
            "/addmember",
            {
                cvsId: temp.curent_conversation,
                memberId: element.userId
            },
            function (responseData) {
                console.log(responseData);
                $scope.conversations = [];
                $scope.loadConversation();
            }, function (errorCode) {
                console.log(errorCode);
            });

        $scope.addMember();
    };
    $scope.addMember = function () {
        communicate.post(
            "/allfriend",
            {
                cvsId: temp.curent_conversation
            },
            function (responseData) {
                $scope.lstContact = responseData;
                $scope.conversations = [];
                $scope.loadConversation();
            }, function (errorCode) {
                console.log(errorCode);
            });
        $scope.showContact = !$scope.showContact;
    };
    //
    $scope.loadChatHistory = function (cvsId, cvsName) {
        $scope.cvsNameBk = cvsName;
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
                if (responseData.length < temp.take) {
                    $scope.isEnd = true;
                    console.log("==================" + $scope.isEnd);
                }
                responseData.forEach(element => {
                    $scope.messages.unshift({
                        id: element.id,
                        isMe: element.userId == userId,
                        value: element.value,
                        msgType: element.type,
                        avatar: hostImg + element.avatar,
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
                        avatar: hostImg + element.avatar,
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
    $scope.saveNameCvs = function () {
        communicate.post(
            "/renameconversation",
            {
                cvsId: temp.curent_conversation,
                name: $scope.conversationName
            }, function (responseData) {
                $scope.conversations = [];
                $scope.loadConversation();
                $scope.edit(true);
                $scope.cvsNameBk = $scope.conversationName;
                console.log(responseData);
            }, function (errorCode) {
                console.log(errorCode);
                $scope.conversationName = $scope.cvsNameBk;
            });
    }
    $scope.edit = function (is) {
        $scope.edit_cvs_name = is;
        $scope.cvs_name_disable = is;
    }
    $scope.sendFile = function () {
        if ($scope.fileBase64 == null || $scope.fileBase64 == '')
            return;
        var sendMsg = function (value,type) {
            var msg = {
                msg_type: type,
                to: temp.curent_conversation,
                value: value
            };
            socket.send(JSON.stringify(msg));
            $scope.message = "";
        }
        var arr = $scope.fileBase64.split(",");
        communicate.post(
            "/uploadfileattachment",
            {
                cvsId: temp.curent_conversation,
                mimeType: arr[0],
                fileName: arr[1],
                file: arr[2]
            },
            function (responseData) {
                var value = hostImg + responseData.url;
                console.log(responseData);
                sendMsg(value,responseData.type);
            }, function (errorCode) {
                console.log(errorCode);
            });

    }
    $scope.addEvent = function () {
        console.log($scope.event);
        if (temp.curent_conversation != "" && $scope.event.time != null)
            communicate.post(
                "/createevent",
                {
                    cvsId: temp.curent_conversation,
                    piority: $scope.event.piority,
                    title: $scope.event.title,
                    content: $scope.event.content,
                    time: toDateStr($scope.event.time)
                },
                function (responseData) {
                    $scope.eventInputShow = false
                    $scope.loadEvent();
                }, function (errorCode) {
                    $scope.eventInputShow = false
                    alert("Thêm sự kiện lỗi " + errorCode);
                    console.log(errorCode);
                });
        else {
            $scope.eventInputShow = false
            alert("Thêm sự kiện lỗi ");
        }
    }

    $scope.delEvent = function (eventId) {
        if (eventId != null)
            communicate.post(
                "/removeevent",
                {
                    eventId: eventId,
                },
                function (responseData) {
                    $scope.eventInputShow = false
                    $scope.loadEvent();
                }, function (errorCode) {
                    $scope.eventInputShow = false
                    alert("Xóa sự kiện lỗi " + errorCode);
                    console.log(errorCode);
                });
        else {
            $scope.eventInputShow = false
            alert("Xóa sự kiện lỗi ");
        }
    }

    $scope.loadFileAtt = function () {
        $scope.files = [];
        if (temp.curent_conversation != "")
            communicate.post(
                "/getfileattachment",
                {
                    cvsId: temp.curent_conversation
                },
                function (responseData) {
                    responseData.forEach(ele => {
                        $scope.files.push({
                            url: ele.url,
                            time: ele.time,
                            userName: ele.userName,
                            fileName: ele.originalFileName,
                        });
                    })
                }, function (errorCode) {
                    console.log(errorCode);
                });
        else {
            alert("Chưa chọn cuộc hội thoại ");
        }
    }
    $scope.loadEvent = function () {
        if (temp.curent_conversation != "") {
            $scope.events = [];
            communicate.post(
                "/getevent",
                {
                    cvsId: temp.curent_conversation,
                },
                function (responseData) {
                    responseData.forEach(ele => {
                        $scope.events.push({
                            title: ele.title,
                            time: ele.actionTime,
                            userName: ele.userName,
                            content: ele.content,
                            piority: getPiority(ele.piority),
                            id: ele.id
                        });
                    })

                }, function (errorCode) {
                    $scope.eventInputShow = false
                    alert("Load sự kiện lỗi " + errorCode);
                    console.log(errorCode);
                });
        }
    }
    var toDateStr = function (date) {
        return date.getFullYear() + ""
            + (date.getMonth() + 1) + ""
            + date.getDate() + ""
            + date.getHours() + ""
            + date.getMinutes() + ""
            + date.getSeconds() + ""
    };
    var getPiority = function (stt) {
        if (stt == 1)
            return "info";
        if (stt == 2)
            return "warning";
        if (stt == 3)
            return "danger";
    }
    var recMsg = function (msg) {
        console.log(msg);
        var msgObj = JSON.parse(msg);
        var msgType = msgObj.msg_type;
        var cvsId = msgObj.to;
        if (cvsId != temp.curent_conversation)
            return;
        if (msgType == 1 || msgType == 3
            || msgType == 4|| msgType == 5
            || msgType == 6 ) {
            var cvsId = msgObj.to;
            var msgElement = {
                isMe: msgObj.from == userId,
                value: msgObj.value,
                name: msgObj.name,
                msgType: msgType,
                avatar: hostImg + msgObj.avt,
                time: 'now'
            };
            // tim 
            $scope.conversations.forEach(ele => {
                if (ele.id == cvsId) {
                    if (msgObj.from != userId) {
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
