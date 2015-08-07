var adminControllers = angular.module('adminControllers', []);

adminControllers.controller('AdminCtrl', [ '$scope', '$rootScope', 'account', '$location', 'moment', function ( scope, rootScope, account, location, moment ) {
	rootScope.menuActive = false;

	scope.updateUserList = function () {
		account.list(function ( data ) {
			if (data.success && data.data) {
				scope.users = data.data;

				_(scope.users).each(function ( user ) {
					user.formattedCreatedDate = moment(user.created_date).format('MM/DD/YYYY HH:mm:ss');
				});
			}
		});
	};

	scope.updateUserList();

	scope.setAdmin = function ( id ) {
		account.setAdmin(id, function ( data ) {
			scope.updateUserList();
		});
	};
	scope.unsetAdmin = function ( id ) {
		account.unsetAdmin(id, function ( data ) {
			scope.updateUserList();
		});
	};
	scope.setCurator = function ( id ) {
		account.setCurator(id, function ( data ) {
			scope.updateUserList();
		});
	};
	scope.unsetCurator = function ( id ) {
		account.unsetCurator(id, function ( data ) {
			scope.updateUserList();
		});
	};
	scope.removeUser = function ( id ) {
		account.removeUser(id, function ( data ) {
			scope.updateUserList();
		});
	};
}]);

module.exports = adminControllers;
