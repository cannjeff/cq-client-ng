var quipControllers = angular.module('quipControllers', []);

quipControllers.controller('QuipsListCtrl', [ '$scope', 'quips', function ( scope, quips ) {
	quips.list(function ( quips ) {
		scope.quips = quips;
	});
}]);

quipControllers.controller('QuipsSolveCtrl', [ '$scope', 'quips', '$routeParams', function ( scope, quips, routeParams ) {
	quips.byID(routeParams.id, function ( quip ) {
		scope.quip = quip;
	});
}]);

module.exports = quipControllers;