var gulp = require('gulp');

gulp.task('default', [ 'sass', 'moveAssets', /*'templateCache', 'images', 'markup',*/ 'watch' ]);
gulp.task('build', [ 'sass', 'moveAssets' ]);