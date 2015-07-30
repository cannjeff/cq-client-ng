var gulp 			= require('gulp');
var debug 			= require('gulp-debug');
var config 			= require('../config').moveAssets;
var browserSync  	= require('browser-sync');
var changed 		= require('gulp-changed');

gulp.task('moveAssets', function () {
	return gulp.src(config.src)
		.pipe(changed(config.dest))
		.pipe(debug({ title: 'moveAssets:' }))
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.reload({ stream: true }));
});