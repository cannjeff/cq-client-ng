var accountControllers = angular.module('accountControllers', []);

accountControllers.controller('AccountCtrl', [ () => {
	rootScope.menuActive = true;
}]);

accountControllers.controller('ChangePasswordCtrl', [ '$rootScope', '$scope', '$location', 'account', 'Notification', ( rootScope, scope, location, account, Notification ) => {
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

module.exports = accountControllers;
