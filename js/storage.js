(function (window) {
  'use strict';

  var Storage = function (namespace) {
    var capitalize = function (string) {
      if (string === '') {
        return string;
      }
      return string[0].toUpperCase() + string.substring(1);
    };

    /**
     * Load from localStorage
     * @returns {object}
     */
    this.getItem = function (key) {
      try {
        return JSON.parse(localStorage.getItem(namespace + capitalize(key)));
      } catch (e) {
        console.error(e);
        return {};
      }
    };

    /**
     * Save to localStorage
     * @returns {boolean} True if save was successful
     */
    this.setItem = function (key, data) {
      try {
        localStorage.setItem(namespace + capitalize(key), JSON.stringify(data));
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    };

    /**
     * Remove item from localStorage
     * @returns {object}
     */
    this.removeItem = function (key) {
      try {
        return localStorage.removeItem(namespace + capitalize(key));
      } catch (e) {
        console.error(e);
        return false;
      }
    };

    /**
     * Clear all items of the namespace
     */
    this.clear = function () {
      Object.keys(localStorage).forEach((key) => {
        if (key.indexOf(namespace) === 0) {
          localStorage.removeItem(key);
        }
      });
    };
  };

  // export to window
  window.app = window.app || {};
  window.app.Storage = Storage;
})(window);
