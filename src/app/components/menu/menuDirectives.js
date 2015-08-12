var menuDirectives = angular.module('menuDirectives', []);

menuDirectives.directive('cqMenu', [ '$rootScope', 'MenuService', function ( rootScope, MenuService ) {
	return {
		templateUrl: './components/menu/menu.html',
		controller: ( $scope ) => {
			$scope.updateMenu = function () {
				$scope.menuItems = MenuService.getMenuForUser();
			};
			$scope.updateMenu();

			rootScope.$on('user-logged-in', () => {
				$scope.updateMenu();
			});
			rootScope.$on('user-logged-out', () => {
				$scope.updateMenu();
			});
		}
	};
}]);

module.exports = menuDirectives;
