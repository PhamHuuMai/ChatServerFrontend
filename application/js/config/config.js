app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "page/account.html"
    })
    .when("/chat", {
        templateUrl : "page/chat.html"
    });
});