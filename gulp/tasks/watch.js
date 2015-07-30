/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp     	= require('gulp');
var config   	= require('../config');
var watch 		= require('gulp-watch');

gulp.task('watch', [ 'watchify', 'browserSync' ], function () {

	watch(config.sass.src, function () {
		gulp.start('sass');
	});
	watch(config.moveAssets.src, function () {
		gulp.start('moveAssets');
	});
	watch(config.jshint.src, function () {
		gulp.start('jshint');
	});

});