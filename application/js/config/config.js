app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/page/account.html",
        controller : "accountCtl"
    })
    .when("/chat", {
        templateUrl : "/page/chat.html",
        controller : "chatCtl"
    });
});