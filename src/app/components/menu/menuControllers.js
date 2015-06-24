var menuControllers = angular.module('menuControllers', []);

menuControllers.controller('MainMenuCtrl', [ '$scope', function ( scope ) {
	scope.menuItems = [{
		text: 'List',
		href: '#/quips',
		isSelected: function () {
			return window.location.hash === this.href;
		}
	}, {
		text: 'Create',
		href: '#/quips/create',
		isSelected: function () {
			return window.location.hash === this.href;
		}
	}];
}]);

module.exports = menuControllers;