var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('LoginCtrl', [ '$rootScope', '$scope', 'account', '$location', 'UserService', function ( rootScope, scope, account, location, UserService ) {
	rootScope.menuActive = false;

	scope.login = function () {
		delete scope.formError;

		account.login({
			username: scope.username,
			password: scope.password
		}, null, function failure ( response ) {
			scope.formError = {
				message: response.message
			};
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

loginControllers.controller('ChangePasswordCtrl', [ '$rootScope', '$scope', '$location', 'account', ( rootScope, scope, location, account ) => {
	rootScope.menuActive = false;

	scope.changePassword = () => {
		delete scope.formError;

		if (scope.newPassword !== scope.repeatNewPassword) {
			scope.formError = { message: 'Passwords don\'t match' };
			return;
		}

		account.changePassword({
			currentPassword: scope.currentPassword,
			newPassword: scope.newPassword
		}, ( response ) => {
			if (response.success) {

			} else {
				scope.formError = { message: 'Failed: Please try again.' };
			}
		});
	};
}]);

module.exports = loginControllers;
