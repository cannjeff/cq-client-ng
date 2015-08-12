var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('LoginCtrl', [ '$rootScope', '$scope', 'account', '$location', 'UserService', 'Notification', function ( rootScope, scope, account, location, UserService, Notification ) {
	rootScope.menuActive = false;

	scope.login = function () {
		account.login({
			username: scope.username,
			password: scope.password
		}, null, function failure ( response ) {
			Notification.error({ message: response.message });
		});
	};
}]);

loginControllers.controller('SignUpCtrl', [ '$rootScope', '$scope', '$location', 'account',  function ( rootScope, scope, location, account ) {
	rootScope.menuActive = false;

	scope.signUp = function () {
		if (scope.password !== scope.repeatPassword) {
			return;
		}
		account.signUp({
			username: scope.username,
			password: scope.password
		}, function ( response ) {
			if (response.success) {
				account.login({
					username: scope.username,
					password: scope.password
				});
			}
		});
	};
}]);

loginControllers.controller('ChangePasswordCtrl', [ '$rootScope', '$scope', '$location', 'account', 'Notification', ( rootScope, scope, location, account, Notification ) => {
	rootScope.menuActive = false;

	scope.changePassword = () => {
		if (scope.newPassword !== scope.repeatNewPassword) {
			Notification.error('Passwords don\'t match');
			return;
		}

		account.changePassword({
			currentPassword: scope.currentPassword,
			newPassword: scope.newPassword
		}, ( response ) => {
			if (response.success) {
				Notification.success('Password changed successfully.');
				location.path('/login');
			} else {
				Notification.error('Failed: Please try again.');
			}
		});
	};
}]);

module.exports = loginControllers;
