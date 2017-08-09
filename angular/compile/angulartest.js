var app = angular.module('app', []);

function cDirective (name) {
  return function () {
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      // scope: {}, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
      compile: function (tElement, tAttrs) {
        console.log(name + ':compile=>' + tElement.html());
        return {
          pre: function (scope, iEle, iAttrs) {
            console.log(name + ':pre=>' + iEle.html());
          },
          post: function (scope, iEle, iAttrs) {
            console.log(name + ':post=>' + iEle.html());
          }
        };
      }
    };
  };
}

app.directive('one', cDirective('one'));
app.directive('two', cDirective('two'));
app.directive('three', cDirective('three'));

app.directive('test', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, el, attr, ctrl) {
      ctrl.$fuck = false
      console.log(ctrl)
      el.bind('focus', function () {
        scope.$apply(function () {
          ctrl.$fuck = true
        })
      })
        .bind('blur', function () {
          scope.$apply(function () {
            ctrl.$fuck = false
          })
        })
    }
  }
})
