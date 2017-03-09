var angular = require('angular-bsfy');

var underscore = angular.module('underscore', []);
underscore.factory('_', function () {
	return window._; /* Underscore must already be loaded on the page */
});

var moment = require('moment');
angular.module('moment', [])
	.factory('moment', () => {
		return moment;
	});

require('ngstorage');
require('./app.services');
require('./components/notification/angular-ui-notification');

window.cqApp = angular.module('cqApp', [
	'cqServices',
	'ngStorage',
	require('angular-bsfy/route').name,
	require('./components/account/accountControllers').name,
	require('./components/login/loginControllers').name,
	require('./components/menu/menuControllers').name,
	require('./components/menu/menuDirectives').name,
	require('./components/quip/quipControllers').name,
	require('./components/admin/adminControllers').name,
	'underscore',
	'moment',
	'ui-notification'
]);

// window.cqApp.__settings = {
// 	api_protocol: localStorage.getItem('cq_api_protocol') || 'https',
// 	api_host: localStorage.getItem('cq_api_host') || 'api.cryptoquip.io',
// 	api_version: localStorage.getItem('cq_api_version') || 'v1',
// 	apiBase: function () {
// 		return this.api_protocol + '://' + this.api_host + '/' + this.api_version + '/';
// 	}
// };

// window.cqApp.__settings = {
// 	api_protocol: 	localStorage.getItem('cq_api_protocol') || window.location.protocol || 'https:',
// 	api_host: 		localStorage.getItem('cq_api_host') || window.location.host || 'api.cryptoquip.io',
// 	api_version: 	localStorage.getItem('cq_api_version') || 'v1',
// 	apiBase: function () {
// 		return this.api_protocol + '//' + this.api_host + '/' + this.api_version + '/';
// 	}
// };


cqApp.config([ '$routeProvider', '$httpProvider', '$locationProvider', function ( routeProvider, httpProvider, $locationProvider )  {
	httpProvider.interceptors.push('tokenInterceptor');

	$locationProvider.hashPrefix('');

	routeProvider
		.when('/', {
			redirectTo: '/login',
		})
		/* Account creation routes */
		.when('/signUp', {
			templateUrl: 'components/login/sign-up.html',
			controller: 'SignUpCtrl'
		})
		.when('/accountCreated', {
			templateUrl: 'components/login/account-created.html'
		})
		.when('/verifyEmail/:token', {
			templateUrl: 'components/login/verify-email.html',
			controller: 'VerifyEmailCtrl'
		})
		.when('/resendVerification', {
			templateUrl: 'components/login/resend-verification.html',
			controller: 'ResendVerificationCtrl'
		})
		/* Auth and Account management routes */
		.when('/login', {
			templateUrl: 'components/login/login.html',
			controller: 'LoginCtrl'
		})
		.when('/account', {
			templateUrl: 'components/account/account.html',
			controller: 'AccountCtrl'
		})
		.when('/account/changePassword', {
			templateUrl: 'components/login/change-password.html',
			controller: 'ChangePasswordCtrl'
		})
		/* Quip routes */
		.when('/quips', {
			templateUrl: 'components/quip/quips-list.html',
			controller: 'QuipsListCtrl'
		})
		.when('/quips/create', {
			templateUrl: 'components/quip/quip-create.html',
			controller: 'QuipsCreateCtrl',
			curator: true
		})
		.when('/quips/quarantine', {
			templateUrl: 'components/quip/quip-quarantine.html',
			controller: 'QuipsQuarantineCtrl',
			curator: true
		})
		.when('/quips/scratchpad', {
			templateUrl: 'components/quip/quip-scratch.html',
			controller: 'QuipsScratchCtrl',
		})
		.when('/quips/:id', {
			templateUrl: 'components/quip/quip-solve.html',
			controller: 'QuipsSolveCtrl'
		})
		.when('/quips/:id/update', {
			templateUrl: 'components/quip/quip-update.html',
			controller: 'QuipUpdateCtrl',
			curator: true
		})
		/* Admin routes */
		.when('/admin', {
			templateUrl: 'components/admin/admin.html',
			controller: 'AdminCtrl',
			admin: true
		});
}]);

cqApp.run([ '$rootScope', '$location', 'UserService', function ( rootScope, location, UserService ) {
	rootScope.$on('$locationChangeStart', ( event, params ) => {
		// var originalPath = params.$$route.originalPath;
		var originalPath = params.substr(params.indexOf('#/') + 2);
		if (originalPath.indexOf('login') !== -1 ||
			originalPath.indexOf('signUp') !== -1 ||
			originalPath.indexOf('verifyEmail') !== -1 ||
			originalPath.indexOf('accountCreated') !== -1 ||
			originalPath.indexOf('resendVerification') !== -1) {
			return;
		}
		if (!UserService.isLoggedIn()) {
			console.log('User not logged in, rerouting to login from', originalPath);
			location.path('/login');
			return;
		}
		if (params.$$route && params.$$route.curator) {
			if (!UserService.isCurator() && !UserService.isAdmin()) {
				console.log('User not a curator');
				event.preventDefault();
				return;
			}
		}
		if (params.$$route && params.$$route.admin) {
			if (!UserService.isAdmin()) {
				console.log('User not an admin');
				event.preventDefault();
			}
		}
	});

	rootScope.$on('$routeChangeSuccess', ( event, params ) => {
		if (typeof ga === 'function') {
			ga('send', 'pageview', params.$$route.originalPath);
		}
	});
}]);

cqApp.factory('tokenInterceptor', [ '$rootScope', '$location', 'UserService', function ( rootScope, location, UserService ) {
	return {
		request: function ( config ) {
			var token = UserService.getOAuthToken();

			config.headers = config.headers || {};

			if (token) {
				config.headers['x-access-token'] = token;
			}

			return config;
		},
		responseError: function ( response ) {
			if (response.status === 401) {
				UserService.logout();
				location.path('/login');
			}
			// location.path('/');
			return response;
		}
	};
}]);

cqApp.factory('account', [ '$rootScope', '$http', '$location', 'UserService', 'APIService', function ( rootScope, http, location, UserService, APIService ) {
	var apiBase = APIService.getApiBase();

	return {
		login: function ( params, callback, failureCb ) {
			if (typeof callback !== 'function') {
				callback = ( response ) => {
					if (response.data.success) {
						if (response.data.token) {
							UserService.setOAuthToken( response.data.token );
							UserService.setCurrentUser( response.data.user );

							rootScope.$broadcast('user-logged-in');

							location.path('/quips');
						}
					} else {
						if (typeof failureCb === 'function') {
							failureCb( response.data );
						}
					}
				};
			}
			http.post(apiBase + 'account/login', params)
				.then( callback );
		},
		signUp: function ( params, callback ) {
			http.post(apiBase + 'account/create', params)
				.success( callback );
		},
		verify: function ( token, callback ) {
			http.get(apiBase + 'account/verify/' + token)
				.success( callback );
		},
		resendVerification: function ( params, callback ) {
			http.post(apiBase + 'account/resendVerification', params)
				.success( callback );
		},
		list: function ( callback ) {
			http.get(apiBase + 'account/list')
				.success( callback );
		},
		setAdmin: function ( id, callback ) {
			http.get(apiBase + 'account/' + id + '/admin')
				.success( callback );
		},
		unsetAdmin: function ( id, callback ) {
			http.get(apiBase + 'account/' + id + '/unsetAdmin')
				.success( callback );
		},
		setCurator: function ( id, callback ) {
			http.get(apiBase + 'account/' + id + '/curator')
				.success( callback );
		},
		unsetCurator: function ( id, callback ) {
			http.get(apiBase + 'account/' + id + '/unsetCurator')
				.success( callback );
		},
		removeUser: function ( id, callback ) {
			http.get(apiBase + 'account/' + id + '/remove')
				.success( callback );
		},
		changePassword: function ( params, callback ) {
			http.post(apiBase + 'account/changePassword', params)
				.success( callback );
		}
	};
}]);

cqApp.factory('quips', [ '$http', 'APIService', function ( http, APIService ) {
	var apiBase = APIService.getApiBase();

	return {
		list: function ( callback ) {
			http({
				method: 'GET',
				url: apiBase + 'quips'
			}).success( callback );
		},
		byID: function ( id, callback ) {
			http({
				method: 'GET',
				url: apiBase + 'quips/' + id
			}).success( callback );
		},
		solve: function ( id, params, callback ) {
			http({
				method: 'GET',
				url: apiBase + 'quips/' + id + '/solve',
				params: params // solution
			}).success( callback );
		},
		create: function ( params, callback ) {
			http.post(apiBase + 'quips/create', params)
				.success(callback);
		},
		update: function ( id, params, callback ) {
			http.post(apiBase + 'quips/' + id + '/update', params)
				.success( callback );
		},
		quarantineList: function ( callback ) {
			http({
				method: 'GET',
				url: apiBase + 'quips',
				params: { quarantine: 1 }
			}).success( callback );
		},
		approve: function ( id, callback ) {
			http({
				method: 'GET',
				url: apiBase + 'quips/' + id + '/approve'
			}).success( callback );
		},
		reject: function ( id, callback ) {
			http({
				method: 'GET',
				url: apiBase + 'quips/' + id + '/reject'
			}).success( callback );
		},
		archive: function ( id, callback ) {
			http.get(apiBase + 'quips/' + id + '/archive')
				.success( callback );
		}
	};
}]);
