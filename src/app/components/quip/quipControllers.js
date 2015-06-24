var quipControllers = angular.module('quipControllers', []);

quipControllers.controller('QuipsListCtrl', [ '$scope', 'quips', function ( scope, quips ) {
	quips.list(function ( quips ) {
		scope.quips = quips;
	});
}]);

quipControllers.controller('QuipsSolveCtrl', [ '$scope', 'quips', '$routeParams', '_', function ( scope, quips, routeParams, _ ) {
	quips.byID(routeParams.id, function ( quip ) {
		scope.quip = quip;
		scope.alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
		scope.keyObject = _.object(scope.alphabet); /* keyObject is a terrible name, but its late and im tired */

		/* Set the hint by default (lock it later?) */
		scope.keyObject[ quip.hint.charAt(0).toUpperCase() ] = quip.hint.slice(-1).toUpperCase();

		scope.updateMap = function ( key ) {
			/* Force uppercase and cap at one letter */
			scope.keyObject[ key ] = scope.keyObject[ key ].slice(-1).toUpperCase();
			
			/* Check for duplicates and replace the old ones */
			var val = scope.keyObject[ key ];
			if (val.length) {
				_(scope.alphabet).each(function ( letter ) {
					/* Exclude the current key. If any others match up clear them */
					if (letter !== key && scope.keyObject[ letter ] === val) {
						scope.keyObject[ letter ] = '';
					}
				});
			}
		};

		scope.valueSetFor = function ( key ) {
			return !!scope.keyObject[ key ].length;
		};

		/* Splitting up the encrypted text string */
		var encryptedText = quip.encrypted_text,
			charArr = encryptedText.split(''),
			chars;

		chars = _.map(charArr, function ( letter ) {
			return {
				value: letter,
				shouldShowInput: function () {
					return /^[a-zA-Z]+$/.test( letter );
				},
				isPunctuation: function () {
					return /^[\.,"':;]$/.test( letter );
				}
			};
		});

		scope.chars = chars;
	});
}]);

module.exports = quipControllers;