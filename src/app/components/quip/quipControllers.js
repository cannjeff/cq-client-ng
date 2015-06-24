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
		var hintKey = quip.hint.charAt(0).toUpperCase(),
			hintVal = quip.hint.slice(-1).toUpperCase();
		scope.keyObject[ hintKey ] = hintVal;

		scope.updateMap = function ( key ) {
			/* Force uppercase and cap at one letter */
			scope.keyObject[ key ] = scope.keyObject[ key ].slice(-1).toUpperCase();

			/* Check for duplicates and replace the old ones */
			var val = scope.keyObject[ key ];
			if (val.length && val !== hintVal) {
				_(scope.alphabet).each(function ( letter ) {
					/* Exclude the current key. If any others match up clear them */
					if (letter !== key && scope.keyObject[ letter ] === val) {
						scope.keyObject[ letter ] = '';
					}
				});
			} else if (val === hintVal) {
				/* Don't allow them to override the hint */
				scope.keyObject[ key ] = '';
			}
		};

		scope.valueSetFor = function ( key ) {
			if (scope.keyObject[ key ]) {
				return !!scope.keyObject[ key ].length;
			} else {
				return false
			}
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
					return /^[\.,"':;?]$/.test( letter );
				},
				isHint: function () {
					return letter === hintKey;
				}
			};
		});

		scope.chars = chars;

		scope.submitSolution = function () {
			var encryptedText = quip.encrypted_text,
				regex = new RegExp(_.keys(scope.keyObject).join('|'), 'g'),
				solution = '';

			solution = encryptedText.replace(regex, function ( matched ) {
				return scope.keyObject[ matched ] || '_';
			});

			quips.solve( quip._id, solution, function ( resp ) {
				resp.solved;
			});
		};
	});
}]);

quipControllers.controller('QuipsCreateCtrl', [ '$scope', 'quips', function ( scope, quips ) {
	scope.quip = {};

	scope.createQuip = function () {
		console.log(scope.quip);
		// quips.create( scope.quip, function ( resp ) {

		// });
	};
}]);

module.exports = quipControllers;