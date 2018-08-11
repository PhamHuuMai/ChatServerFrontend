app.factory('communicate', ['$http', '$window', function ($http, $window) {
    // https://chatserver-maiph.herokuapp.com/
    var service = {};
    $window.sessionStorage = {};
    service.post = function (url, request, successCallback, errorCallback) {
        console.log($http.defaults.headers.common);
        $http.defaults.headers.common.Authorization = $window.sessionStorage.token;
        console.log($http.defaults.headers.common);
        $http.post(
            method = (apiHost + url),
            data = request
        ).then(function (response) {
            console.log(response);
            var data = response.data;
            if (data.code == 0)
                successCallback(data.data);
            else
                errorCallback(data.code);
        }, function (response) {
            console.log(response);
            errorCallback(-1);
        });
    };
    return service;
}])