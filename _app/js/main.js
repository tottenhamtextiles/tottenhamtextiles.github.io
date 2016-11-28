// Define Dependencies
var detect = require('./lib/detect');
var jquery = require('./lib/jquery');
// var history = require('./modules/history');
// var jekyllAjax = require('./modules/jekyllAjax');
var grid = require('./modules/grid');
// // Detect if JavaScript is enabled
detect();

jquery();
// history();
// jekyllAjax();
grid();
//
// // Print success message to console
// console.log('<head> scripts loaded.')


$(window).on('load', function() {
  // var $container = $('.grid');

  // $container.imagesLoaded( function() {
    $('.grid').masonry({
    // options
    itemSelector: '.grid-item'
    });
  // });
});
