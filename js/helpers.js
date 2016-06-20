/* exported $, $$, prev */
var $ = document.querySelectorAll.bind(document);
var $$ = document.querySelector.bind(document);
Element.prototype.on = Element.prototype.addEventListener;

function prev(event) {
  if (event.preventDefault) { event.preventDefault(); }
  else { event.returnValue = false; }
}