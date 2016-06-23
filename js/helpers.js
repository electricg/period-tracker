/* exported $, $$, prev, z, $delegate */
var $ = document.querySelectorAll.bind(document);
var $$ = document.querySelector.bind(document);
Element.prototype.on = Element.prototype.addEventListener;

// https://developer.mozilla.org/en/docs/Web/API/NodeList
NodeList.prototype.forEach = Array.prototype.forEach;

/**
 * Prevent default event
 * @param {object} event
 */
function prev(event) {
  if (event.preventDefault) { event.preventDefault(); }
  else { event.returnValue = false; }
}

/**
 * Convert number into two digit string
 * @param {number} n
 * @returns {string}
 */
function z(n) {
  if (n < 10) {
    return '0' + n;
  }
  return '' + n;
}

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
    var potentialElements = target.querySelectorAll(selector);
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

  target.addEventListener(type, dispatchEvent, !!useCapture);
};
