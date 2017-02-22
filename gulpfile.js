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
	zip = require('gulp-zip'),
	imagemin = require('gulp-imagemin'),
	minifyHtml = require('gulp-html-minifier');

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
gulp.task('less', () => {
	return gulp.src(paths.lessDir + '/lupaduca.less')
		.pipe(less())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(gulp.dest(paths.cssDir))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Minify HTML
gulp.task('minify-html', () => {
	return gulp.src('index.html')
		.pipe(minifyHtml({collapseWhitespace: true, removeComments: true}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(''));
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], () => {
	return gulp.src(paths.cssDir + '/lupaduca.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename({suffix: '.min'}))
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
gulp.task('minify-js', ['build'], () => {
	return gulp.src(paths.libDir + '/core/animate.js')
		.pipe(uglify())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.srcDir))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', ['clean', 'minify-css', 'minify-js'], () => {

	//Copy Libs
	gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
		.pipe(gulp.dest('lib/bootstrap'));

	gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
		.pipe(gulp.dest('lib/jquery'));

	gulp.src([paths.libDir + '/bootstrap/js/bootstrap.min.js'])
		.pipe(gulp.dest(paths.distDir + '/lib/bootstrap/js'));

	gulp.src([paths.libDir + '/bootstrap/css/bootstrap.min.css'])
		.pipe(gulp.dest(paths.distDir + '/lib/bootstrap/css'));

	gulp.src([paths.libDir + '/jquery/jquery.min.js'])
		.pipe(gulp.dest(paths.distDir + '/lib/jquery'));

	//Copy Htmls
	gulp.src(['index.min.html'])
		.pipe(rename('index.html'))
		.pipe(gulp.dest(paths.distDir));

	//Copy CSS
	gulp.src(paths.cssDir + "/lupaduca.min.css")
		.pipe(gulp.dest(paths.distDir + '/css'));

	//Copy JS
	gulp.src(paths.srcDir + "/animate.min.js")
		.pipe(gulp.dest(paths.distDir + '/js'));

	//Copy Images
	// gulp.src([paths.imgDir + '/**'])
	// 	.pipe(gulp.dest(paths.distDir + '/img'));

	//Copy Fonts
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


// Optimize images
gulp.task('image-min', ['clean'], () => {
	return gulp.src(paths.imgDir + '/**')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.distDir + '/img'));
});

// Run everything
gulp.task('default', ['less', 'minify-css', 'build', 'minify-js', 'minify-html']);

// Run production task
gulp.task('dist', ['clean', 'default', 'copy', 'image-min']);

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