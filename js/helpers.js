/* exported $, $$, prev, z, $delegate */
var $ = document.querySelectorAll.bind(document);
var $$ = document.querySelector.bind(document);
Element.prototype.on = Element.prototype.addEventListener;

function prev(event) {
  if (event.preventDefault) { event.preventDefault(); }
  else { event.returnValue = false; }
}

function z(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

window.qsa = function (selector, scope) {
  return (scope || document).querySelectorAll(selector);
};

window.$on = function (target, type, callback, useCapture) {
  target.addEventListener(type, callback, !!useCapture);
};

/**
 * Attach a handler to event for all elements that match the selector,
 * now or in the future, based on a root element
 */
var $delegate = function(target, selector, type, handler) {
  function dispatchEvent(event) {
    var el = event.target;
    var els = [];
    var found = false;
    var hasMatch;
    var potentialElements = window.qsa(selector, target);
    while (el) {
      els.unshift(el);
      el = el.parentNode;
      hasMatch = Array.prototype.indexOf.call(potentialElements, el) >= 0;
      if (hasMatch) {
        found = true;
        break;
      }
    }
    if (found) {
      handler.call(el);
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/Events/blur
  var useCapture = type === 'blur' || type === 'focus';

  window.$on(target, type, dispatchEvent, useCapture);
};