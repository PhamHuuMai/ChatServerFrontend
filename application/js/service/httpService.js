app.factory('communicate', ['$http', '$window', function ($http, $window) {
    // https://chatserver-maiph.herokuapp.com/
    var service = {};
    $window.sessionStorage = {};
    service.post = function (url, request, successCallback, errorCallback) {
        $http.defaults.headers.common.Authorization = $window.sessionStorage.token;
        $http.post(
            method = (apiHost + url),
            data = request
        ).then(function (response) {
            var data = response.data;
            if (data.code == 0)
                successCallback(data.data);
            else
                errorCallback(data.code);
        }, function (response) {
            errorCallback(-1);
        });
    };
    return service;
}])