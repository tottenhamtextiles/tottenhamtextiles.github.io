var paths = {};

// Directory locations
var appDir             = '_app/';  // The files Gulp will work on
var jekyllDir          = '';       // The files Jekyll will work on
var siteDir            = '_site/'; // The resulting static site

// Folder naming conventions
var postFolderName   = '_posts';
var draftFolderName  = '_drafts';
var imageFolderName  = 'images';
var fontFolderName   = 'fonts';
var vendorFolderName = 'vendor';
var scriptFolderName = 'js';
var stylesFolderName = 'css';

// App files locations
var appCssFiles    = appDir  + stylesFolderName;
var appJsFiles     = appDir  + scriptFolderName;
var appImageFiles  = appDir  + imageFolderName;
var appFontFiles   = appDir  + fontFolderName;
var appVendorFiles = appDir  + vendorFolderName;

// Jekyll files locations
var jekyllPostFiles    = jekyllDir + postFolderName;
var jekyllDraftFiles   = jekyllDir + draftFolderName;
var jekyllImageFiles   = jekyllDir + 'assets/' + imageFolderName;
var jekyllFontFiles    = jekyllDir + 'assets/' + fontFolderName;
var jekyllScriptFiles  = jekyllDir + 'assets/' + scriptFolderName;
var jekyllStyleFiles   = jekyllDir + 'assets/' + stylesFolderName;

// Site files locations
var siteImageFiles   = siteDir   + '/assets/' + imageFolderName;
var siteFontFiles    = siteDir   + '/assets/' + fontFolderName;

// Glob patterns by file type
var cssPattern         = '/**/*.css';
var jsPattern          = '**/*.js';
var imagePattern       = '/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)';
var markdownPattern    = '/**/*.+(md|MD|markdown|MARKDOWN)';
var htmlPattern        = '/**/*.html';
var xmlPattern         = '/**/*.xml';
var fontPatterns       = '/**.*';

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
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});

// Places all fonts in appropriate location(s)
gulp.task('build:fonts', function() {
  return gulp.src(appFontFilesGlob)
    .pipe(rename(function(path) {path.dirname = '';}))
    .pipe(gulp.dest(jekyllFontFiles))
    // .pipe(gulp.dest(siteFontFiles))
    .pipe(browserSync.stream())
    .pipe(size({showFiles: true}))
    .on('error', gutil.log);
});


// Creates optimized versions of images,
// then outputs to appropriate location(s)
gulp.task('build:images', function() {
  return gulp.src(appImageFilesGlob)
    .pipe(gulp.dest(jekyllImageFiles))
    // .pipe(gulp.dest(siteImageFiles))
    .pipe(browserSync.stream())
    .pipe(size({showFiles: true}))
    .on('error', gutil.log);
})

// Concatenates and uglifies JS files and outputs result to
// the appropriate location(s).
gulp.task('build:scripts', function() {
  return gulp.src(appJsFilesGlob)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jekyllScriptFiles))
    .pipe(size({showFiles: true}))
    .on('error', gutil.log);

  // gulp.src(appJsFilesGlob)
  //   .pipe(include({
  //     extensions: "js",
  //     hardFail: true,
  //     includePaths: [
  //       __dirname + "/_app/js"
  //     ]
  //   }))
  //   .pipe(gulp.dest(jekyllScriptFiles));
    //
    // gulp.src(appJsFilesGlob)
    //   .pipe(include({
    //     extensions: "js",
    //     hardFail: true,
    //     includePaths: [
    //       __dirname + "/_app/js"
    //     ]
    //   }))
    //   .pipe(gulp.dest("./dist"));
});
//
// gulp.src("js/main.js")
//   .pipe(include({
//     extensions: "js",
//     hardFail: true,
//     includePaths: [
//       __dirname + "/js"
//     ]
//   }))
//   .pipe(gulp.dest("./dist"));

// Runs Jekyll build
gulp.task('build:jekyll', function() {
  var shellCommand = 'bundle exec jekyll build --config _config.yml,_app/localhost_config.yml';
  // if (config.drafts) { shellCommand += ' --drafts'; };

  return gulp.src(jekyllDir)
    .pipe(run(shellCommand))
    .on('error', gutil.log);
});

// Builds site
// Optionally pass the --drafts flag to enable including drafts
// gulp.task('build', function(cb) {
//   runSequence(['build:scripts', 'build:images', 'build:styles', 'build:fonts'],
//               'build:jekyll',
//               cb);
// });

gulp.task('build', ['build:scripts', 'build:images', 'build:styles', 'build:fonts', 'build:jekyll'], function(){
  debug({title: 'unicorn:'});
});

/* Sass and image file changes can be streamed directly to BrowserSync without
reloading the entire page. Other changes, such as changing JavaScript or
needing to run jekyll build require reloading the page, which BrowserSync
recommends doing by setting up special watch tasks.*/
// Special tasks for building and then reloading BrowserSync
gulp.task('build:jekyll:watch', ['build:jekyll'], function(cb) {
  browserSync.reload();
  cb();
});
gulp.task('build:scripts:watch', ['build:scripts'], function(cb) {
  browserSync.reload();
  cb();
});


// Static Server + watching files
// WARNING: passing anything besides hard-coded literal paths with globs doesn't
//          seem to work with the gulp.watch()
gulp.task('serve', ['build'], function() {

  debug({path: appJsFilesGlob })

  browserSync.init({
    server: siteDir,
    ghostMode: false, // do not mirror clicks, reloads, etc. (performance optimization)
    logFileChanges: true,
    open: false       // do not open the browser (annoying)
  });

  // Watch site settings
  gulp.watch(['_config.yml', '_app/localhost_config.yml'], ['build:jekyll:watch']);

  // Watch app .css files, changes are piped to browserSync
  gulp.watch('_app/css/**/*.css', ['build:styles']);

  // Watch app .js files
  gulp.watch('_app/js/**/*.js', ['build:scripts:watch']);

  // Watch Jekyll posts
  gulp.watch('_posts/**/*.+(md|markdown|MD)', ['build:jekyll:watch']);

  // Watch Jekyll drafts if --drafts flag was passed
  // if (config.drafts) {
  //   gulp.watch('_drafts/*.+(md|markdown|MD)', ['build:jekyll:watch']);
  // }

  // Watch Jekyll html files
  gulp.watch(['**/*.html', '_site/**/*.*'], ['build:jekyll:watch']);

  // Watch Jekyll RSS feed XML file
  gulp.watch('feed.xml', ['build:jekyll:watch']);

  // Watch Jekyll data files
  gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);

  // Watch Jekyll favicon.ico
  gulp.watch('favicon.ico', ['build:jekyll:watch']);
});
