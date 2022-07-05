/* exported $, $$ */
var $ = document.querySelectorAll.bind(document);
var $$ = document.querySelector.bind(document);
Element.prototype.on = Element.prototype.addEventListener;

// https://developer.mozilla.org/en/docs/Web/API/NodeList
NodeList.prototype.forEach = Array.prototype.forEach;

(function (window) {
  var Helpers = function () {
    const _datePattern = 'YYYY-MM-DD';
    const _today = moment();
    const _todayStr = _today.format(_datePattern);

    Object.defineProperty(this, 'today', {
      get: function () {
        return _today;
      },
    });

    Object.defineProperty(this, 'todayStr', {
      get: function () {
        return _todayStr;
      },
    });

    Object.defineProperty(this, 'datePattern', {
      get: function () {
        return _datePattern;
      },
    });

    /**
     * Convert number into two digit string
     * @param {number} n
     * @returns {string}
     */
    this.z = function (n) {
      if (n < 10) {
        return '0' + n;
      }
      return '' + n;
    };

    /**
     * Prevent default event
     * @param {object} event
     */
    this.prev = function (event) {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    };

    /**
     * Attach a handler to event for all elements that match the selector,
     * now or in the future, based on a root element
     */
    this.$delegate = function (target, selector, type, handler) {
      function dispatchEvent(event) {
        var el = event.target;
        var els = [];
        var found = false;
        var hasMatch;
        var potentialElements = target.querySelectorAll(selector);
        while (el) {
          els.unshift(el);
          hasMatch = Array.prototype.indexOf.call(potentialElements, el) >= 0;
          if (hasMatch) {
            found = true;
            break;
          }
          el = el.parentNode;
        }
        if (found) {
          handler.call(el);
        }
      }

      // https://developer.mozilla.org/en-US/docs/Web/Events/blur
      var useCapture = type === 'blur' || type === 'focus';

      target.addEventListener(type, dispatchEvent, !!useCapture);
    };

    /**
     * Download a file with the given name and content, this is for old browsers
     * @param {string} filename - name of the file
     * @param {string} text - content of the file
     */
    this.oldDownload = function (filename, text) {
      var el = document.createElement('a');
      el.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
      );
      el.setAttribute('download', filename);

      el.style.display = 'none';
      document.body.appendChild(el);

      el.click();

      document.body.removeChild(el);
    };
  };

  window.helpers = new Helpers();
})(window);
