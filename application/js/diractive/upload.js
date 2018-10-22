app.directive('base64', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                var file = element[0].files[0];
                if(file.size > 1048576){
                    alert('Kích cỡ file lớn hơn 4 MB');
                    return;
                }
                scope.$apply(function () {
                    scope.base64 = '';
                    var base64 = '';
                    if (element[0].files[0] == null) {
                        scope.base64 = '';
                    } else {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            var result = reader.result;
                            var arr = result.split(",");
                            var base64 = file.type + ',' + file.name + ',' ;
                            scope.base64 = base64 + arr[1];
                            scope.fileName = file.name; 
                            scope.type = file.type;
                            scope.size = file.size; 
                        };
                        reader.onerror = function (error) {
                            scope.base64 = '';
                        };
                    }
                });
            });
        },
        scope :{
            base64: '=base64',
            size: '=size',
            type: '=type',
            filename: '=fileName'
        }
    };
}]);