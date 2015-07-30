var gulp = require('gulp');

gulp.task('default', [ 'sass', 'moveAssets', 'jshint', 'watch' ]);
gulp.task('build', [ 'sass', 'moveAssets', 'jshint', 'browserify' ]);