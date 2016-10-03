// Gulp tasks for JKL Tachyons

// Load plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    include = require('gulp-include'),
    css = require('css'),
    browserSync = require('browser-sync'),
    browserReload = browserSync.reload,
    child = require('child_process'),
    postcss = require('gulp-postcss'),
    cssvariables = require('postcss-css-variables'),
    atImport = require("postcss-import"),
    customMedia = require("postcss-custom-media"),
    include = require("gulp-include"),
    at2x = require('postcss-at2x'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    transform = require('vinyl-transform'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    rename = require('gulp-rename');

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['serve',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('js', function() {

  var bundleStream = browserify('./assets/scripts/head.js').bundle()

  bundleStream
    .pipe(source("./assets/scripts/head.js"))
    .pipe(streamify(uglify()))
    .pipe(rename('head.js'))
    .pipe(gulp.dest("./dist"))

  // return gulp.src(["./assets/scripts/head.js"])
  //   .pipe(browserified)
  //   .pipe(uglify())
  //   .pipe(gulp.dest("./dist"));
});

gulp.task('css', function() {
  var processors = [
      atImport(),
      customMedia(),
      cssvariables(),
      at2x(),
  ];
  gulp.src('./assets/styles/styles.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist'));
});



/*
   DEFAULT TASK

 • Process sass then auto-prefixes and lints outputted css
 • Starts a server on port 3000
 • Reloads browsers when you change html or sass files

*/
gulp.task('default', ['css', 'js', 'jekyll']);

gulp.task('watch', function() {
  gulp.watch('assets/styles/**/*', ['css']);
  gulp.watch('assets/scripts/**/*', ['js']);
  gulp.watch(['*.html', './**/*.html'], ['jekyll']);
 });
