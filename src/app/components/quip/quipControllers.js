var quipControllers = angular.module('quipControllers', []);

quipControllers.controller('QuipsListCtrl', [ '$scope', function ( scope ) {
	console.log('quipControllers loaded');
}]);

module.exports = quipControllers;