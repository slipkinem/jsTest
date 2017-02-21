var app = angular.module('app', []);

app.controller('users', ['$scope', function($scope){
	$scope.userinfo = {
		name:"",
		tel:"",
		email:""
	};
	
}]);
app.directive('userinfo', [function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div>name:{{userinfo.name}}</div><br/>tel:{{userinfo.tel}}<br/>email:{{userinfo.email}}',
		// templateUrl: '',
		replace: false,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.log('userinfo下面的link');
			$scope.userinfo.name = "请输入内容";			
		}
	};
}]);