var gulp 			= require('gulp');
var debug 			= require('gulp-debug');
var config 			= require('../config').moveAssets;
var assetsToMove	= [
		config.src + '/*.html',
		config.src + '/app/**/**/*.html',
		config.src + '/assets/libs/*'
	];

gulp.task('moveAssets', function () {
	return gulp.src(assetsToMove)
		.pipe(debug({ title: 'moveAssets:' }))
		.pipe(gulp.dest(config.dest));
});