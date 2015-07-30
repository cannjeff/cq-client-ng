var menuControllers = angular.module('menuControllers', []);

menuControllers.controller('MainMenuCtrl', [ '$scope', function ( scope ) {
}]);

menuControllers.controller('UserCtrl', [ '$rootScope', '$scope', 'UserService', '$localStorage', ( rootScope, scope, UserService, localStorage ) => {
	scope.currentUser = UserService.getCurrentUser();

	scope.logout = () => {
		scope.currentUser = null;
		UserService.logout();
	};
}]);

module.exports = menuControllers;
