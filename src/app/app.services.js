var angular = require('angular-bsfy');

var cqServices = angular.module('cqServices', []);

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

module.exports = cqServices;
