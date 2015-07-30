var menuDirectives = angular.module('menuDirectives', []);

menuDirectives.controller('MainMenuCtrl', [ '$scope', function ( scope ) {
	scope.menuItems = [{
		text: 'List',
		href: '#/quips',
		isSelected: function () {
			return window.location.hash === this.href;
		}
	}, {
		text: 'Scratchpad',
		href: '#/quips/scratchpad',
		isSelected: function () {
			return window.location.hash === this.href;
		}
	}, {
		text: 'Create',
		href: '#/quips/create',
		isSelected: function () {
			return window.location.hash === this.href;
		}
	}, {
		text: 'Quarantine',
		href: '#/quips/quarantine',
		isSelected: function () {
			return window.location.hash === this.href;
		}
	}, {
		text: 'Admin',
		href: '#/admin',
		isSelected: function () {
			return window.location.hash === this.href;
		}
	}];
}]);

menuDirectives.directive('cqMenu', function () {
	return {
		templateUrl: './components/menu/menu.html'
	};
});

module.exports = menuDirectives;
