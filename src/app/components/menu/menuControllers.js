var menuControllers = angular.module('menuControllers', []);

menuControllers.controller('UserCtrl', [ '$rootScope', '$scope', 'UserService', '$localStorage', '$location', ( rootScope, scope, UserService, localStorage, location ) => {
	scope.currentUser = UserService.getCurrentUser();

	rootScope.$on('user-logged-in', () => {
		scope.currentUser = UserService.getCurrentUser();
	});

	scope.logout = () => {
		scope.currentUser = null;
		UserService.logout();
	};
	scope.changePassword = () => {
		location.path('/changePassword');
	};
}]);

module.exports = menuControllers;
