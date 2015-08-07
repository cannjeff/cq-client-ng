var quipControllers = angular.module('quipControllers', []);

quipControllers.controller('QuipsListCtrl', [ '$rootScope', '$scope', '$location', 'quips', '_', 'moment', function ( rootScope, scope, location, quips, _, moment ) {
	rootScope.menuActive = false;

	quips.list(function ( quips ) {
		_(quips).each(function ( quip ) {
			if (quip.created_date) {
				quip.formattedCreatedDate = moment(quip.created_date).format('dddd, MMMM Do YYYY');
			}
		});
		scope.quips = quips;
	});

	scope.navToQuip = ( id ) => {
		location.path( '/quips/' + id);
	};
}]);

quipControllers.controller('QuipsSolveCtrl', [ '$rootScope', '$scope', 'quips', '$routeParams', '_', function ( rootScope, scope, quips, routeParams, _ ) {
	rootScope.menuActive = false;

	quips.byID(routeParams.id, function ( quip ) {
		scope.quip = quip;
		scope.alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
		scope.keyObject = _.object(scope.alphabet); /* keyObject is a terrible name, but its late and im tired */
		scope.dictHistory = [];
		scope._ = _;

		/* Set the hint by default (lock it later?) */
		var hintKey = quip.hint_key.toUpperCase(),
			hintVal = quip.hint_value.toUpperCase();
		scope.keyObject[ hintKey ] = hintVal;

		scope.dictHistory.push( _.extend({}, scope.keyObject) );

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
				scope.dictHistory.push( _.extend({}, scope.keyObject) );
			} else if (val === hintVal) {
				/* Don't allow them to override the hint */
				scope.keyObject[ key ] = '';
			}
			console.log(scope.dictHistory.length);
		};

		scope.valueSetFor = function ( key ) {
			if (scope.keyObject[ key ]) {
				return !!scope.keyObject[ key ].length;
			} else {
				return false;
			}
		};

		scope.undo = function () {
			if (scope.dictHistory.length > 1) { /* Always leave the initial entry */
				scope.keyObject = scope.dictHistory.pop();
			}
		};

		scope.reset = () => {
			scope.keyObject = _.object(scope.alphabet);
			scope.keyObject[ hintKey ] = hintVal;
			scope.dictHistory = [];
			scope.dictHistory.push( _.extend({}, scope.keyObject) );
		};

		/* Splitting up the encrypted text string */
		// var encryptedText = quip.encrypted_text,
		// 	charArr = encryptedText.split(''),
		// 	chars;

		// chars = _.map(charArr, function ( letter ) {
		// 	return {
		// 		value: letter,
		// 		shouldShowInput: function () {
		// 			return /^[a-zA-Z]+$/.test( letter );
		// 		},
		// 		isPunctuation: function () {
		// 			return /^[\.,"':;?]$/.test( letter );
		// 		},
		// 		isHint: function () {
		// 			return letter === hintKey;
		// 		}
		// 	};
		// });

		// scope.chars = chars;
		var wordToObj = ( letter ) => {
			return {
				value: letter,
				shouldShowInput: () => {
					return /^[a-zA-Z]+$/.test( letter );
				},
				isPunctuation: () => {
					return /^[\.,"':;?]$/.test( letter );
				},
				isHint: () => {
					return letter === hintKey;
				}
			};
		};

		var words = quip.encrypted_text.split(' ');
		_(words).each(( word, idx, arr ) => {
			arr[idx] = _(word.split('')).map(wordToObj);
		});
		scope.words = words;

		scope.submitSolution = function () {
			var encryptedText = quip.encrypted_text,
				regex = new RegExp(_.keys(scope.keyObject).join('|'), 'g'),
				params = {
					solution: '',
					keyObject: scope.keyObject
				};

			params.solution = encryptedText.replace(regex, function ( matched ) {
				return scope.keyObject[ matched ] || '_';
			});

			quips.solve( quip._id, params, function ( resp ) {
				// resp.solved;
			});
		};

		scope.focus = function ( idx) {
			console.log('focus', idx);
		};

		scope.blur = function () {
			console.log('blur');
		};
	});
}]);

quipControllers.controller('QuipsCreateCtrl', [ '$rootScope', '$scope', 'quips', function ( rootScope, scope, quips ) {
	rootScope.menuActive = false;

	scope.quip = {};

	scope.createQuip = function () {
		quips.create( scope.quip, function ( resp ) {
			console.log('create resp', resp);
		});
	};
}]);

quipControllers.controller('QuipsQuarantineCtrl', [ '$rootScope', '$scope', 'quips', function ( rootScope, scope, quips ) {
	rootScope.menuActive = false;

	quips.quarantineList(function ( quips ) {
		scope.quips = quips;
	});

	scope.approve = function ( id ) {
		quips.approve( id, function ( resp ) {

		});
	};

	scope.reject = function ( id ) {
		quips.reject( id, function ( resp ) {

		});
	};
}]);

quipControllers.controller('QuipsScratchCtrl', [ '$rootScope', '$scope', function ( rootScope, scope ) {
	rootScope.menuActive = false;

	scope.alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
	scope.keyObject = _.object(scope.alphabet);
	scope.quip = { encrypted_text: '' };

	scope.updateMap = function ( key ) {
		/* Force uppercase and cap at one letter */
		scope.keyObject[ key ] = scope.keyObject[ key ].slice(-1).toUpperCase();

		key = key.toUpperCase();

		/* Check for duplicates and replace the old ones */
		var val = scope.keyObject[ key ];
		if (val && val.length) {
			_(scope.alphabet).each(function ( letter ) {
				/* Exclude the current key. If any others match up clear them */
				if (letter !== key && scope.keyObject[ letter ] === val) {
					scope.keyObject[ letter ] = '';
				}
			});
		}
	};

	scope.updateQuip = function () {
		var encryptedText = scope.quip.encrypted_text.toUpperCase(),
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
				}
			};
		});

		scope.chars = chars;
	};
}]);

module.exports = quipControllers;
