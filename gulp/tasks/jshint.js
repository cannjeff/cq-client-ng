/**
 *	jshint.js
 *	=========
 *	JS linting
 **/

var gulp 			= require('gulp');
var	jshint 			= require('gulp-jshint');
var config 			= require('../config').jshint;
var jshintStylish	= require('jshint-stylish');
var handleErrors 	= require('../util/handleErrors');
var plumber 		= require('gulp-plumber');
var map				= require('map-stream');
var path 			= require('path');
var events 			= require('events');
var emitter 		= new events.EventEmitter();

/**
 *	Custom error reporter
 **/
var jsHintErrorReporter = function ( file, callback ) {
	return map(function ( file, callback ) {
		if (!file.jshint.success) {
			file.jshint.results.forEach(function ( error ) {
				if (error) {
					var msg = [
						path.basename(file.path),
						'Line: ' + error.error.line,
						'Reason: ' + error.error.reason
					];

					emitter.emit('error', new Error(msg.join('\n')));
				}
			});
		}

		callback(null, file);
	});
};

gulp.task('jshint', function () {
	return gulp.src(config.src)
		.pipe(plumber())
		.pipe(jshint({ esnext: true, debug: true }))
		.pipe(jshint.reporter(jshintStylish)) /* To the console */
		.pipe(jsHintErrorReporter()) /* Emits error for notify to pick up below */
		.on('error', handleErrors);
});
