var menuControllers = angular.module('menuControllers', []);

menuControllers.controller('UserCtrl', [ '$rootScope', '$scope', 'UserService', '$localStorage', '$location', ( rootScope, scope, UserService, localStorage, location ) => {
	scope.currentUser = UserService.getCurrentUser();

	rootScope.$on('user-logged-in', () => {
		scope.currentUser = UserService.getCurrentUser();
	});

	scope.logout = () => {
		scope.currentUser = null;
		UserService.logout();
		rootScope.$broadcast('user-logged-out');
	};
	scope.changePassword = () => {
		location.path('/account/changePassword');
	};
}]);

module.exports = menuControllers;
