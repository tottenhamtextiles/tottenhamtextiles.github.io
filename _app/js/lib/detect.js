modules.export = {

/**
 * Replace `.no-js` class with `.js` class on <html> element. Use as a
 * simple method to detect if JavaScript it enabled in the browser.
 */

var html = document.documentElement
html.className = html.className.replace(/\bno-js\b/g, '') + ' js '

}
