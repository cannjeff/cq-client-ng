var dest = './public';
var src = './src';

module.exports = {
	browserSync: {
		server: {
			// Serve up our build folder
			baseDir: dest
		},
		open: false,
		https: false
	},
	sass: {
		src: [
			src + '/assets/css/*.{sass,scss}',
			src + '/assets/css/**/*.{sass,scss}',
			src + '/assets/css/**/**/*.{sass,scss}'
		],
		dest: dest + '/css',
		settings: {
			// indentedSyntax: true, // Enable .sass syntax!
			imagePath: 'images' // Used by the image-url helper
		}
	},
	browserify: {
		// A separate bundle will be generated for each
		// bundle config in the list below
		bundleConfigs: [/*{
			entries: src + '/javascript/global.coffee',
			dest: dest,
			outputName: 'global.js',
			// Additional file extentions to make optional
			extensions: ['.coffee', '.hbs'],
			// list of modules to make require-able externally
			require: [ 'jquery', 'backbone/node_modules/underscore' ]
			// See https://github.com/greypants/gulp-starter/issues/87 for note about
			// why this is 'backbone/node_modules/underscore' and not 'underscore'
		}, */{
			entries: [ src + '/app/app.module.js' ],
			dest: dest + '/js',
			outputName: 'app.js',
			// list of externally available modules to exclude from the bundle
			external: [ 'jquery', 'underscore' ]
		}]
	},
	moveAssets: {
		src: [
			src + '/*.html',
			src + '/app/**/**/*.html',
			src + '/assets/libs/*'
		],
		dest: dest
	},
	templateCache: {
		src: src,
		dest: dest
	},
	jshint: {
		src: [
			src + '/app/*.js',
			src + '/app/**/*.js',
			src + '/app/**/**/*.js',
			src + '/app/**/**/**/*.js'
		]
	}
};
