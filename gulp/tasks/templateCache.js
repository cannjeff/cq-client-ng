var gulp 			= require('gulp');
var debug 			= require('gulp-debug');
var templateCache 	= require('gulp-angular-templatecache');
var config 			= require('../config').templateCache;
var templates 		= [
		config.src + '/app/**/**/*.html'
	];

gulp.task('templateCache', function () {
	return gulp.src(templates)
		.pipe(debug({ title: 'templateCache:' }))
		.pipe(templateCache())
		.pipe(gulp.dest(config.dest));
});