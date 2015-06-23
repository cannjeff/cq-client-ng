var angular = require('angular-bsfy');

window.cqApp = angular.module('cqApp', [
	require('angular-bsfy/route').name,
	require('./components/quip/quipControllers').name
]);

window.cqApp.__settings = {
	api_host: 'api.cryptoquip.io',
	api_version: 'v1',
	apiBase: function () {
		return 'http://' + this.api_host + '/' + this.api_version + '/';
	}
};

cqApp.config([ '$routeProvider', function ( routeProvider ) {
	routeProvider
		.when('/', {
			template: '<div>Hey there!</div>',
		})
		.when('/quips', {
			templateUrl: 'components/quip/quips-list.html',
			controller: 'QuipsListCtrl'
		})
		.when('/quips/:id', {
			templateUrl: 'components/quip/quip-solve.html',
			controller: 'QuipsSolveCtrl'
		});
}]);

cqApp.factory('quips', [ '$http', function ( http, countries ) {
	return {
		list: function ( callback ) {
			http({
				method: 'GET',
				url: window.cqApp.__settings.apiBase() + 'quips'
			}).success( callback );
		},
		byID: function ( id, callback ) {
			http({
				method: 'GET',
				url: window.cqApp.__settings.apiBase() + 'quips/' + id
			}).success( callback );
		}
	}
}]);