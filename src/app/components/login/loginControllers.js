var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('SignUpCtrl', [ '$rootScope', '$scope', '$location', 'account', 'Notification',  function ( rootScope, scope, location, account, Notification ) {
	rootScope.menuActive = false;

	scope.signUp = function () {
		if (scope.disableSignUp) {
			return; /* Prevent button click spamming */
		}
		scope.disableSignUp = true;
		if (scope.password !== scope.repeatPassword) {
			Notification.error('Passwords do not match.');
			scope.disableSignUp = false;
			return;
		}
		account.signUp({
			username: 	scope.username,
			email: 		scope.email,
			password: 	scope.password
		}, function ( response ) {
			if (response.success) {
				Notification.success('Account created successfully.');
				location.path('/accountCreated');
			} else {
				Notification.error(response.message);
				scope.disableSignUp = false;
			}
		});
	};
}]);

loginControllers.controller('VerifyEmailCtrl', [ '$rootScope', '$scope', '$routeParams', '$location', 'account', 'Notification', ( rootScope, scope, routeParams, location, account, Notification ) => {
	rootScope.menuActive = false;

	account.verify(routeParams.token, ( response ) => {
		if (response.success) {
			Notification.success('Email verified!');
			location.path('/login');
		} else {
			Notification.error(response.message);
			scope.pageError = {
				message: response.message
			};
		}
	});
}]);

loginControllers.controller('ResendVerificationCtrl', [ '$rootScope', '$scope', '$location', 'account', 'Notification', ( rootScope, scope, location, account, Notification ) => {
	rootScope.menuActive = false;

	scope.resend = () => {
		account.resendVerification({
			email: scope.email
		}, function ( response ) {

		});
	};
}]);

loginControllers.controller('LoginCtrl', [ '$rootScope', '$scope', 'account', '$location', 'UserService', 'Notification', function ( rootScope, scope, account, location, UserService, Notification ) {
	rootScope.menuActive = false;

	if (UserService.isLoggedIn()) {
		location.path('/quips');
	}

	scope.login = function () {
		account.login({
			username: scope.username,
			password: scope.password
		}, null, function failure ( response ) {
			Notification.error({ message: response.message });
		});
	};
}]);

module.exports = loginControllers;
