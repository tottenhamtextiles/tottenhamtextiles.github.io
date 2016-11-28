var paths = {};

var siteRoot = '_site';
// Directory locations
var appDir             = '_app/';  // The files Gulp will work on
var jekyllDir          = '';       // The files Jekyll will work on
var siteDir            = '_site/'; // The resulting static site

// Folder naming conventions
var postFolderName   = '_posts';
var draftFolderName  = '_drafts';
var imageFolderName  = 'images';
var fontFolderName   = 'fonts';
var scriptFolderName = 'js';
var stylesFolderName = 'css';

// Glob patterns by file type
var cssPattern         = '/**/*.css';
var jsPattern          = '/main.js';
var imagePattern       = '/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF|mp4)';
var markdownPattern    = '/**/*.+(md|MD|markdown|MARKDOWN)';
var htmlPattern        = '/**/*.html';
var xmlPattern         = '/**/*.xml';
var fontPatterns       = '/**.*';

// App files locations
var appCssFiles    = appDir  + stylesFolderName;
var appJsFiles     = appDir  + scriptFolderName;
var appImageFiles  = appDir  + imageFolderName;
var appFontFiles   = appDir  + fontFolderName;

// Jekyll files locations
var jekyllPostFiles    = jekyllDir + postFolderName;
var jekyllDraftFiles   = jekyllDir + draftFolderName;
var jekyllImageFiles   = jekyllDir + 'assets/' + imageFolderName;
var jekyllFontFiles    = jekyllDir + 'assets/' + fontFolderName;
var jekyllScriptFiles  = siteDir + 'assets/' + scriptFolderName;
var jekyllScriptFiles2  = jekyllDir + 'assets/' + scriptFolderName;
var jekyllStyleFiles   = jekyllDir + 'assets/' + stylesFolderName;
var jekyllStyleFiles2   = siteDir + 'assets/' + stylesFolderName;

// App files globs
var appCssFilesGlob      = appCssFiles      + cssPattern;
var appJsFilesGlob       = appJsFiles       + jsPattern;
var appImageFilesGlob    = appImageFiles    + imagePattern;
var appFontFilesGlob     = appFontFiles     + fontPatterns;

// Jekyll files globs
var jekyllPostFilesGlob    = jekyllPostFiles  + markdownPattern;
var jekyllDraftFilesGlob   = jekyllDraftFiles + markdownPattern;
var jekyllHtmlFilesGlob    = jekyllDir        + htmlPattern;
var jekyllXmlFilesGlob     = jekyllDir        + xmlPattern;
var jekyllImageFilesGlob   = jekyllImageFiles + imagePattern;

// Site files globs
var siteHtmlFilesGlob    = siteDir + htmlPattern;


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
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    runSequence  = require('run-sequence'),
    debug = require('gulp-debug'),
    concat = require('gulp-concat'),
    size = require('gulp-size'),
    run = require('gulp-run');



// Uses Sass compiler to process styles, adds vendor prefixes, minifies,
// and then outputs file to appropriate location(s)
gulp.task('build:styles', function() {
  var processors = [
      atImport(),
      customMedia(),
      cssvariables(),
      at2x(),
  ];
  gulp.src(appCssFilesGlob)
    .pipe(postcss(processors))
    .pipe(gulp.dest(jekyllStyleFiles))
    .on('error', gutil.log);
});

// Places all fonts in appropriate location(s)
gulp.task('build:fonts', function() {
  return gulp.src(appFontFilesGlob)
    .pipe(rename(function(path) {path.dirname = '';}))
    .pipe(gulp.dest(jekyllFontFiles))
    .pipe(size({showFiles: true}))
    .on('error', gutil.log);
});


// Creates optimized versions of images,
// then outputs to appropriate location(s)
gulp.task('build:images', function() {
  return gulp.src(appImageFilesGlob)
    .pipe(gulp.dest(jekyllImageFiles))
    .pipe(size({showFiles: true}))
    .on('error', gutil.log);
})

// Concatenates and uglifies JS files and outputs result to
// the appropriate location(s).
gulp.task('build:scripts', function() {
  var bundleStream = browserify(appJsFilesGlob).bundle()
  bundleStream
    .pipe(source("appJsFilesGlob"))
    .pipe(rename('main.js'))
    .pipe(gulp.dest(jekyllScriptFiles))
    .pipe(gulp.dest(jekyllScriptFiles2))
});

// Runs Jekyll build
gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
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


gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch('_app/css/**/*.css', ['build:styles']);
});


// gulp.task('build', ['build:scripts', 'build:images', 'build:styles', 'build:fonts', 'build:jekyll'], function(){
//   debug({title: 'unicorn:'});
// });


gulp.task('default', ['build:scripts', 'build:images', 'build:fonts', 'build:styles', 'jekyll', 'serve']);

/* Sass and image file changes can be streamed directly to BrowserSync without
reloading the entire page. Other changes, such as changing JavaScript or
needing to run jekyll build require reloading the page, which BrowserSync
recommends doing by setting up special watch tasks.*/
// Special tasks for building and then reloading BrowserSync
// gulp.task('build:jekyll:watch', ['build:jekyll'], function(cb) {
//   browserSync.reload();
//   cb();
// });
//
// gulp.task('build:scripts:watch', ['build:scripts'], function(cb) {
//   cb();
// });

// Static Server + watching files
// WARNING: passing anything besides hard-coded literal paths with globs doesn't
//          seem to work with the gulp.watch()


// gulp.task('serve', ['build'], function() {
//
//   debug({path: appJsFilesGlob })
//
//   browserSync.init({
//     server: siteDir,
//     ghostMode: false, // do not mirror clicks, reloads, etc. (performance optimization)
//     logFileChanges: true,
//     open: false       // do not open the browser (annoying)
//   });
//
//   // Watch site settings
//   gulp.watch(['_config.yml', '_app/localhost_config.yml'], ['build:jekyll']);
//   // Watch app .css files, changes are piped to browserSync
//   gulp.watch('_app/css/**/*.css', ['build:styles']);
//   // Watch app .js files
//   gulp.watch('_app/js/**/*.js', ['build:scripts']);
//   // Watch Jekyll posts
//   gulp.watch('_posts/**/*.+(md|markdown|MD)', ['build:jekyll']);
//   // Watch Jekyll html files
//   gulp.watch(['**/*.html', '_site/**/*.*'], ['build:jekyll']);
//   // Watch Jekyll RSS feed XML file
//   gulp.watch('feed.xml', ['build:jekyll:watch']);
//   // Watch Jekyll data files
//   gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll']);
//   // Watch Jekyll favicon.ico
//   gulp.watch('favicon.ico', ['build:jekyll:watch']);
// });
