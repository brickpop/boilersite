// INFO: http://markgoodyear.com/2014/01/getting-started-with-gulp/

var parameters = {
  productionFolder: "/var/www/html",
  developmentFolder: "/var/www/html/dev"
};

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    mocha = require('gulp-mocha'),
    shell = require('gulp-shell');

// Styles
gulp.task('styles', function() {
  return gulp.src(['app/vendor/**/*.css', 'app/styles/index.css', 'app/styles/index.scss'])
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 2.3'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'));
});

// JSHint
gulp.task('jshint', function() {
  return gulp.src(['app/scripts/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Scripts
gulp.task('scripts', ['jshint', 'vendor'], function() {
  return gulp.src(['app/scripts/**/*.js'])
    .pipe(concat('index.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('vendor', ['modernizr'], function() {
  return gulp.src(['app/vendor/*.js', '!app/vendor/modernizr.min.js', 
      'app/vendor/angular/angular.min.js', 'app/vendor/angular/angular-route.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/vendor'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('dist/vendor'));
});

gulp.task('modernizr', function() {
  return gulp.src(['app/vendor/modernizr.min.js'])
    .pipe(gulp.dest('dist/vendor'));
});


// Images
gulp.task('images', ['favicon'], function() {
  return gulp.src(['app/img/**/*'])
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'));
});
gulp.task('favicon', function() {
  return gulp.src(['app/favicon.ico'])
    .pipe(gulp.dest('dist'));
});

// HTML
gulp.task('html', function() {
  return gulp.src(['app/**/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
});

// PHP
gulp.task('php', function() {
  return gulp.src(['app/**/*.php'])
    .pipe(gulp.dest('dist/'));
});

// Test
gulp.task('test', function () {
    gulp.src('test/index.js')
        .pipe(mocha({reporter: 'nyan'}));
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/**/*.html', 'dist/**/*.php', 'dist/lib', 'dist/views', 'dist/styles', 'dist/scripts', 'dist/img'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('html', 'php', 'styles', 'scripts', 'images');
});

// Deploy PRO
gulp.task('pro', shell.task([
  'gulp clean && gulp && echo "Copying files to ' + parameters.productionFolder + '" && cp -R ./dist/* ' + parameters.productionFolder
]));

// Deploy DEV
gulp.task('dev', shell.task([
  'gulp clean && gulp && echo "Copying files to ' + parameters.developmentFolder + '" && cp -R ./dist/* ' + parameters.developmentFolder
]));

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('app/**/*.html', ['html']);

  // Watch .scss files
  gulp.watch('app/**/*.php', ['php']);

  // Watch .scss files
  gulp.watch('app/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('app/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('app/img/**/*', ['images']);

  // Create LiveReload server
  var server = livereload();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', function(file) {
    server.changed(file.path);
  });

});