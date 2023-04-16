/* exported $, $$ */
/* global dates */
'use strict';

var $ = document.querySelectorAll.bind(document);
var $$ = document.querySelector.bind(document);
Element.prototype.on = Element.prototype.addEventListener;

// https://developer.mozilla.org/en/docs/Web/API/NodeList
NodeList.prototype.forEach = Array.prototype.forEach;

(function (window) {
  var Helpers = function () {
    const _datePattern = 'YYYY-MM-DD';
    const _today = dates.newDate();
    const _todayStr = _today.formatDate(_datePattern);

    const _notSupported =
      'This functionality is not supported in your browser/os/device';

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
      if (typeof n === 'string') {
        if (n === '') {
          return n;
        }
        const n2 = Number(n);
        if (Number.isNaN(n2)) {
          return n;
        }
        n = n2;
      }
      if (typeof n === 'number') {
        if (n > 0 && n < 10) {
          return '0' + n;
        }
        return '' + n;
      }
      return n;
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
    const oldDownload = function (filename, text) {
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

    /**
     * Read content from uploaded file
     * @param {object} file
     * @returns {Promise} promise with the content
     */
    this.readFromInputFile = async function (file) {
      if (!('FileReader' in window)) {
        throw _notSupported;
      }

      const reader = new FileReader();
      if (file) {
        reader.readAsText(file);
      }

      return new Promise((resolve) => {
        reader.addEventListener(
          'load',
          function () {
            resolve(reader.result);
          },
          false
        );
      });
    };

    /**
     * Write content into file
     * @param {string} filename - name of the file
     * @param {string} text - content of the file
     * @returns {Promise}
     */
    this.writeToFile = async function (filename, text) {
      if (!('showSaveFilePicker' in window)) {
        oldDownload(filename, text);
        return;
      }

      const options = {
        suggestedName: filename,
        types: [{ accept: { 'text/plain': ['.txt'] } }],
      };

      try {
        const fileHandle = await window.showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
      } catch (e) {
        // if the user doesn't save the file, swallow the relative browser error
      }
    };

    /**
     * Share content to other apps
     * @param {string} filename - name of the file
     * @param {string} text - content of the file
     * @param {string} title - title of the file
     */
    this.shareTo = function (filename, text, title) {
      const file = new File([text], filename, { type: 'text/plain' });
      const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

      // Firefox has a bug where text is not actually shared, and
      // sharing of files is not supported at all, so functionality is
      // totally disabled for it
      // https://github.com/mozilla-mobile/fenix/issues/11946
      if (navigator.canShare && !isFirefox) {
        const sharedObj = {
          title: title,
        };

        if (navigator.canShare({ files: [file] })) {
          sharedObj.files = [file];
        } else if (navigator.canShare({ text: text })) {
          sharedObj.text = text;
        }

        navigator.share(sharedObj).catch(() => {
          // if the user doesn't share the file, swallow the relative browser error
        });
      } else {
        throw _notSupported;
      }
    };

    /**
     * Create a unique identifier
     */
    this.uid = function () {
      return `${performance.now()}${Math.random()
        .toString()
        .replace('0.', '')}`.replace('.', '');
    };
  };

  window.helpers = new Helpers();
})(window);
