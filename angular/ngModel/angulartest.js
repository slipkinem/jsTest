var app = angular.module('app', []);
app.controller('testC', function ($scope) {
  $scope.test = new Date()
  $scope.clickTest = function () {
    $scope.test = new Date(1994)
  }
  $scope.clickTest2 = function () {
    console.log($scope.test)
  }
})
$scope.$watch()

app.directive('testDir', function ($filter) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, el, attr, ctrl) {
      // console.log(ctrl.$viewValue)
      /**
       * 用unshift是要将自定义视图处理放在第一位置
       * 视图改变 [parsers] =>  数据改变
       * 数据改变 [formatters] => 视图改变
       */
      ctrl.$parsers.unshift(function (viewValue) {
        console.log('$parsers方法被调用')
        var modelValue = $filter('date')(viewValue, 'yyyy-MM-dd')
        console.log(modelValue)
        return '2000-06-08'
      })

      ctrl.$formatters.push(function (modelValue) {
        console.log('$formatters方法被调用')
        var viewValue = modelValue || undefined
        console.log(viewValue)
        return viewValue
      })
    }
  }
})
