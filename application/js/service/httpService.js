app.factory('communicate', ['$http','$window', function ($http,$window) {
    // https://chatserver-maiph.herokuapp.com/
    var service = {};
    $window.sessionStorage = {};
    service.post = function (url, request, successCallback, errorCallback) {
        $http.post(
            apiHost + url,
            {
               data : request,
               headers : {
                    Authorization : $window.sessionStorage.token
               }
            }
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