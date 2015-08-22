var angular = require('angular-bsfy');

var cqServices = angular.module('cqServices', []);


// https://cryptoquip.io -> https://api.cryptoquip.io/v1/
// https://test.cryptoquip.io -> https://testapi.cryptoquip.io/v1/
// http://localhost:3000 -> http://localhost:4000/v1/

cqServices.service('APIService', [ '$window',  ( $window ) => {
	var protocol 	= localStorage.getItem('cq_api_protocol') 	|| $window.location.protocol,
		host 		= localStorage.getItem('cq_api_host') 		|| $window.location.host,
		port 		= localStorage.getItem('cq_api_port'),
		version 	= localStorage.getItem('cq_api_version') 	|| 'v1';


	function apiBase() {
		var base = protocol + '//' + host;
		if (port && port.length > 0) {
			base += ':' + port;
		}
		base += '/' + version + '/';
		return base;
	}

	var map = {
		'http://localhost:3000': 'http://localhost:4000/v1/',
		'https://test.cryptoquip.io': 'https://testapi.cryptoquip.io/v1/',
		'https://cryptoquip.io': 'https://api.cryptoquip.io/v1/'
	};

	return {
		getApiBase: () => { return map[ $window.location.origin ]; }
	};
}]);

cqServices.service('UserService', [ '$localStorage', '$location', ( localStorage, location ) => {
	var storage = localStorage;

	storage.oauth = storage.oauth || {};

	return {
		setCurrentUser: ( user ) => { storage.currentUser = user; },
		getCurrentUser: () => { return storage.currentUser; },
		setOAuthToken: ( token ) => { storage.oauth.token = token; },
		getOAuthToken: () => { return storage.oauth.token; },
		isCurator: () => {
			var isCurator = false;
			if (storage.currentUser) {
				isCurator = storage.currentUser.curator === true;
			}
			return isCurator;
		},
		isAdmin: () => {
			var isAdmin = false;
			if (storage.currentUser) {
				isAdmin = storage.currentUser.admin === true;
			}
			return isAdmin;
		},
		isLoggedIn: () => { return storage.currentUser ? true : false; },
		logout: () => {
			delete storage.currentUser;
			delete storage.oauth.token;
			location.path('/');
		}
	};
}]);

cqServices.service('MenuService', [ '$rootScope', 'UserService', ( rootScope, UserService ) => {
	return {
		getMenuForUser: menuForUser
	};

	function menuForUser() {
		var menu = [];

		if (!UserService.isLoggedIn()) {
			rootScope.hideMenu = true;
		} else {
			rootScope.hideMenu = false;
		}

		menu = [{
			text: 'List',
			href: '#/quips',
			isSelected: function () {
				return window.location.hash === this.href;
			}
		}, {
			text: 'Scratchpad',
			href: '#/quips/scratchpad',
			isSelected: function () {
				return window.location.hash === this.href;
			}
		}];

		if (UserService.isCurator()) {
			menu.push({
				text: 'Create',
				href: '#/quips/create',
				isSelected: function () {
					return window.location.hash === this.href;
				}
			}, {
				text: 'Quarantine',
				href: '#/quips/quarantine',
				isSelected: function () {
					return window.location.hash === this.href;
				}
			});
		}

		if (UserService.isAdmin()) {
			menu.push({
				text: 'Admin',
				href: '#/admin',
				isSelected: function () {
					return window.location.hash === this.href;
				}
			});
		}

		/* Add the Account menu last */
		menu.push({
			text: 'Account',
			href: '#/account',
			isSelected: function () {
				return window.location.hash === this.href;
			}
		});

		return menu;
	}
}]);

module.exports = cqServices;
