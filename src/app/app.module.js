var angular = require('angular-bsfy');

var underscore = angular.module('underscore', []);
underscore.factory('_', function () {
	return window._; /* Underscore must already be loaded on the page */
});

window.cqApp = angular.module('cqApp', [
	require('angular-bsfy/route').name,
	require('./components/menu/menuControllers').name,
	require('./components/quip/quipControllers').name,
	'underscore'
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
		.when('/quips/create', {
			templateUrl: 'components/quip/quip-create.html',
			controller: 'QuipsCreateCtrl'
		})
		.when('/quips/quarantine', {
			templateUrl: 'components/quip/quip-quarantine.html',
			controller: 'QuipsQuarantineCtrl'
		})
		.when('/quips/scratchpad', {
			templateUrl: 'components/quip/quip-scratch.html',
			controller: 'QuipsScratchCtrl',
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
		},
		solve: function ( id, solution, callback ) {
			http({
				method: 'GET',
				url: window.cqApp.__settings.apiBase() + 'quips/' + id + '/solve',
				params: { solution: solution }
			}).success( callback );
		},
		create: function ( params, callback ) {
			http({
				method: 'GET',
				url: window.cqApp.__settings.apiBase() + 'quips/create',
				params: params
			}).success( callback );
		},
		quarantineList: function ( callback ) {
			http({
				method: 'GET',
				url: window.cqApp.__settings.apiBase() + 'quips_quarantine/'
			}).success( callback );
		},
		approve: function ( id, callback ) {
			http({
				method: 'GET',
				url: window.cqApp.__settings.apiBase() + 'quips_quarantine' + id + '/approve'
			}).success( callback );
		},
		reject: function ( id, callback ) {
			http({
				method: 'GET',
				url: window.cqApp.__settings.apiBase() + 'quips_quarantine' + id + '/reject'
			}).success( callback );
		}
	}
}]);