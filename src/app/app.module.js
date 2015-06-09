var angular = require('angular-bsfy');

window.cqApp = angular.module('cqApp', [
	require('angular-bsfy/route').name,
	require('./components/quip/quipControllers').name
]);

cqApp.config([ '$routeProvider', function ( routeProvider ) {
	routeProvider
		.when('/', {
			template: '<div>Hey there!</div>',
		})
		.when('/quips', {
			templateUrl: 'components/quip/quips-list.html',
			controller: 'QuipsListCtrl'
		});
}]);