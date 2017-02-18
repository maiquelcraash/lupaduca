const gulp = require('gulp'),
	less = require('gulp-less'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),                            //plugin that reload the CSS in all browsers
	header = require('gulp-header'),
	cleanCSS = require('gulp-clean-css'),
	rename = require("gulp-rename"),
	uglify = require('gulp-uglify'),
	pkg = require('./package.json'),
	clean = require('gulp-clean'),
	babel = require('gulp-babel'),
	zip = require('gulp-zip');

// Set the banner content
let banner = ['/*!\n',
	' * Lupaduca - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
	' * Copyright 2016-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
	' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
	' */\n',
	''
].join('');


const paths = {
	cssDir: "css",
	imgDir: "img",
	srcDir: "js",
	lessDir: "less",
	libDir: "lib",
	distDir: "dist"
};

// Cleans the dist/ directory
//plugin em https://www.npmjs.com/package/gulp-clean
gulp.task('clean', function () {
	return gulp.src(paths.distDir + '/*')
		.pipe(clean());
});

// Compile LESS files from /less into /css
gulp.task('less', function () {
	return gulp.src(paths.lessDir + '/lupaduca.less')
		.pipe(less())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(gulp.dest(paths.cssDir))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Minify compiled CSS
gulp.task('minify-css', ['less', 'clean'], function () {
	return gulp.src(paths.cssDir + '/lupaduca.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.distDir + '/css'))
		.pipe(gulp.dest(paths.cssDir))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Transpiles JS
gulp.task('build', () => {    //add "lint" if you want to use de eslinter
	return gulp.src(paths.srcDir + '/animate.js')
		.pipe(babel())
		.pipe(gulp.dest(paths.libDir + '/core'));
});

// Minify JS
gulp.task('minify-js', ['clean', 'build'], () => {
	return gulp.src(paths.libDir + '/core/animate.js')
		.pipe(uglify())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.distDir + '/js'))
		.pipe(gulp.dest(paths.srcDir))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy' , ['clean', 'minify-css', 'minify-js'], function () {
	gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
		.pipe(gulp.dest('lib/bootstrap'));

	gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
		.pipe(gulp.dest('lib/jquery'));

	gulp.src(['node_modules/tether/dist/js/tether.js', 'node_modules/tether/dist/js/tether.min.js'])
		.pipe(gulp.dest('lib/tether'));

	gulp.src(['index.html'])
		.pipe(gulp.dest(paths.distDir));

	gulp.src([paths.libDir + '/bootstrap/js/bootstrap.min.js'])
		.pipe(gulp.dest(paths.distDir + '/lib/bootstrap/js'));

	gulp.src([paths.libDir + '/bootstrap/css/bootstrap.min.css'])
		.pipe(gulp.dest(paths.distDir + '/lib/bootstrap/css'));

	gulp.src([paths.libDir + '/jquery/jquery.min.js'])
		.pipe(gulp.dest(paths.distDir + '/lib/jquery'));

	gulp.src([paths.imgDir + '/**'])
		.pipe(gulp.dest(paths.distDir + '/img'));

	gulp.src([
		'node_modules/font-awesome/**',
		'!node_modules/font-awesome/**/*.map',
		'!node_modules/font-awesome/.npmignore',
		'!node_modules/font-awesome/*.txt',
		'!node_modules/font-awesome/*.md',
		'!node_modules/font-awesome/*.json'
	])
		.pipe(gulp.dest('lib/font-awesome'))
});

// Run everything
gulp.task('default', ['clean', 'less', 'minify-css', 'build', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: ''
		},
	})
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function () {
	gulp.watch('less/*.less', ['less']);
	gulp.watch('css/*.css', ['minify-css']);
	gulp.watch('js/*.js', ['minify-js']);
	// Reloads the browser whenever HTML or JS files change
	gulp.watch('*.html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});