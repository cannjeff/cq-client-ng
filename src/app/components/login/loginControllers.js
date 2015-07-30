var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('LoginCtrl', [ '$scope', '$rootScope', 'account', '$location', 'UserService', function ( scope, rootScope, account, location, UserService ) {
	scope.login = function () {
		account.login({
			username: scope.username,
			password: scope.password
		}, function ( response ) {
			if (response.success) {
				if (response.token) {
					UserService.setOAuthToken( response.token );
					UserService.setCurrentUser( response.user );

					location.path('/quips');
				}
			}
		});
	};
}]);

loginControllers.controller('SignUpCtrl', [ '$scope', '$location', 'account',  function ( scope, location, account ) {
	scope.signUp = function () {
		if (scope.password !== scope.repeatPassword) {
			return;
		}
		account.signUp({
			username: scope.username,
			password: scope.password
		}, function ( response ) {
			if (response.success) {
				location.path('/quips');
			}
		});
	};
}]);

module.exports = loginControllers;
