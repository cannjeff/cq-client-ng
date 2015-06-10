var quipControllers = angular.module('quipControllers', []);

quipControllers.controller('QuipsListCtrl', [ '$scope', 'quips', function ( scope, quips ) {
	quips.list(function ( quips ) {
		scope.quips = quips;
	});
}]);

module.exports = quipControllers;